const saft = require('../models/Saft');

const getKpiInfo = async (req, res, next) => {
    const movementsInfo = await saft.aggregate([{ $match: { 'Header.FiscalYear': +req.body.FiscalYear } },
    {
        $project: {
            'SourceDocuments.SalesInvoices.NumberOfEntries': 1,
            'SourceDocuments.SalesInvoices.TotalCredit': 1,
            'GeneralLedgerEntries.NumberOfEntries': 1,
            'GeneralLedgerEntries.TotalCredit': 1
        }
    }
    ]).catch(next)

    //Retorna o total de Compras(index 1) e Vendas (index 0)
    const jsonTotalSalesAndPurchases = await saft.aggregate([{ $match: { 'Header.FiscalYear': +req.body.FiscalYear } },
    { $unwind: '$GeneralLedgerEntries.Journal' },
    { $unwind: '$GeneralLedgerEntries.Journal.Transaction' },
    { $unwind: '$GeneralLedgerEntries.Journal.Transaction.Lines.CreditLine' },
    {
        $group: {
            '_id': '$GeneralLedgerEntries.Journal.Description',
            'Total': { $sum: '$GeneralLedgerEntries.Journal.Transaction.Lines.CreditLine.CreditAmount' },
        }
    },
    { $sort: { _id: 1 } }
    ]).catch(next)

    if ((movementsInfo && movementsInfo.length > 0) && 
        (jsonTotalSalesAndPurchases && jsonTotalSalesAndPurchases.length > 0)) {

        // const stringified = JSON.stringify(movementsInfo);
        // const obj = JSON.parse(stringified);
        const TotalEntries = movementsInfo[0].GeneralLedgerEntries.NumberOfEntries;
        // const TotalCredit = movementsInfo[0].GeneralLedgerEntries.TotalCredit;
        const NumberOfSales = movementsInfo[0].SourceDocuments.SalesInvoices.NumberOfEntries;
        const SalesValue = movementsInfo[0].SourceDocuments.SalesInvoices.TotalCredit;

        // const stringifiedTotals = JSON.stringify(jsonTotalSalesAndPurchases);
        // const obj2 = JSON.parse(stringifiedTotals);
        const totalCompras = jsonTotalSalesAndPurchases[0].Total;
        const totalVendas = jsonTotalSalesAndPurchases[1].Total;

        res.json({
            TotalEntries: TotalEntries,
            TotalProfit: (Math.round((SalesValue - totalCompras) * 100) / 100).toFixed(2),
            NumberOfSales: NumberOfSales,
            NumberOfPurchases: TotalEntries - NumberOfSales,
            SalesValue: SalesValue,
            totalCompras: totalCompras,
            totalVendas: totalVendas
        })
    } else {
        next({ message: `No Transaction Movements data was found for the requested ${ req.body.FiscalYear } Fiscal Year!`, status: 404 })
    }
}

//Retorna informação referente a cada Movimentação: Ou seja, valores de  compras() e vendas(organizadas por período)
const getDiagramInvoices = async (req, res, next) => {

    // console.log(req.body.FiscalYear)

    //Vendas por mês, tendo em conta os Invoices
    const jsonInvoicesMonth = await saft.aggregate([{ $match: { 'Header.FiscalYear': +req.body.FiscalYear } },
    { $unwind: '$SourceDocuments.SalesInvoices.Invoice' },
    {
        $group: {
            '_id': '$SourceDocuments.SalesInvoices.Invoice.Period',
            'MonthTotal': { $sum: '$SourceDocuments.SalesInvoices.Invoice.DocumentTotals.GrossTotal' }, //Com Impostos
            'MonthNetTotal': { $avg: '$SourceDocuments.SalesInvoices.Invoice.DocumentTotals.GrossTotal' } //Sem, Impostos
        }
    },
    { $sort: { '_id': 1 } }
    ]
    ).catch(next);

    let months = [];
    let monthTotal = [];
    let monthNetTotal = [];

    for (data in jsonInvoicesMonth) {
        months.push('' + jsonInvoicesMonth[data]._id);
        monthTotal.push(jsonInvoicesMonth[data].MonthTotal);
        monthNetTotal.push(jsonInvoicesMonth[data].MonthNetTotal)
    }

    res.json({
        months,
        monthTotal,
        monthNetTotal
    })
}

//Get all Invoices
const getTableInvoices = async (req, res, next) => {

    console.log('FISCAL YEAR: ' + req.body.FiscalYear)

    const invoices = await saft.aggregate([{ $match: { 'Header.FiscalYear': +req.body.FiscalYear } },
    { $unwind: '$SourceDocuments.SalesInvoices.Invoice' },
    {
        $project: {
            'SourceDocuments.SalesInvoices.NumberOfEntries': 1,
            'SourceDocuments.SalesInvoices.Invoice.InvoiceNo': 1,
            'SourceDocuments.SalesInvoices.Invoice.InvoiceDate': 1,
            'SourceDocuments.SalesInvoices.Invoice.CustomerID': 1,
            'SourceDocuments.SalesInvoices.Invoice.DocumentTotals.GrossTotal': 1,
            'SourceDocuments.SalesInvoices.Invoice.DocumentTotals.NetTotal': 1
        }
    }
    ]).catch(next)

    const customers = await saft.aggregate([
        { $unwind: '$MasterFiles.Customer' },
        {
            $project: {
                'MasterFiles.Customer.CompanyName': 1,
                'MasterFiles.Customer.CustomerID': 1
            }
        },
        { $sort: { '_id': -1 } }
    ]).catch(next);

    // # Organizar os dados depois de efetuada a Query (remover os embeded documents)
    if (invoices && invoices.length > 0) {
        // const stringified = JSON.stringify(invoices);
        // const obj = JSON.parse(stringified);
        let invoiceInfo = []

        let InvoiceNo, InvoiceDate, CustomerID, CompanyName, GrossTotal, NetTotal, TaxTotal;
        const NumberOfEntries = invoices[0].SourceDocuments.SalesInvoices.NumberOfEntries;
        // console.log(invoices[0])

        for (let i = 0; i < NumberOfEntries; i++) {
            tempCustomer = customers.find( elem => elem.MasterFiles.Customer.CustomerID === invoices[i].SourceDocuments.SalesInvoices.Invoice.CustomerID);
            CompanyName = tempCustomer.MasterFiles.Customer.CompanyName;
            CustomerID = tempCustomer.MasterFiles.Customer.CustomerID;

            InvoiceNo = invoices[i].SourceDocuments.SalesInvoices.Invoice.InvoiceNo;
            InvoiceDate = invoices[i].SourceDocuments.SalesInvoices.Invoice.InvoiceDate;
            GrossTotal = invoices[i].SourceDocuments.SalesInvoices.Invoice.DocumentTotals.GrossTotal;
            NetTotal = invoices[i].SourceDocuments.SalesInvoices.Invoice.DocumentTotals.NetTotal;
            TaxTotal = (Math.round((GrossTotal - NetTotal) * 100) / 100).toFixed(2);
            invoiceInfo.push({ InvoiceNo, InvoiceDate, CustomerID, CompanyName, GrossTotal, NetTotal, TaxTotal })
        }
        res.json(invoiceInfo)
    } else {
        next({ message: `No Invoices data was found for the requested ${ req.body.FiscalYear } Fiscal Year!`, status: 404 })
    }
}

const getPieChartCustomer = async (req, res, next) => {
    // ## Info for Client per Location PIE CHART
    const clientPerLocation = await saft.aggregate([{ $match: { 'Header.FiscalYear': +req.body.FiscalYear } },
    { $unwind: '$MasterFiles.Customer' },
    {
        $group: {
            '_id': '$MasterFiles.Customer.BillingAddress.City',
            'locationCount': { $sum: 1 }
        }
    }
    ]).catch(next)

    let cities = [], count = [];

    for (data in clientPerLocation) {
        cities.push(`"${clientPerLocation[data]._id}"`);
        count.push(clientPerLocation[data].locationCount);
    }

    // ## Info for Percentage Sales per Client PIE CHART
    const salesPerClient = await saft.aggregate([{ $match: { 'Header.FiscalYear': +req.body.FiscalYear } },
    { $unwind: '$SourceDocuments.SalesInvoices.Invoice' },
    {
        $group: {
            '_id': '$SourceDocuments.SalesInvoices.Invoice.CustomerID',
            'clientPurchases': { $sum: 1 }
        }
    },
    { $sort: { '_id': -1 } }
    ]).catch(next)

    const client = await saft.aggregate([
        { $unwind: '$MasterFiles.Customer' },
        {
            $project: {
                'MasterFiles.Customer.CompanyName': 1,
                'MasterFiles.Customer.CustomerID': 1
            }
        },
        { $sort: { 'MasterFiles.Customer.CustomerID': -1 } }
    ]).catch(next);

    let customer = [], percent = [], totalCount = 0, countPercentage = 0;

    for (i in salesPerClient) {
        totalCount += salesPerClient[i].clientPurchases;
    }

    for (data in client) {
        for (i in salesPerClient)
        if (client[data].MasterFiles.Customer.CustomerID == salesPerClient[i]._id) {
            customer.push(`"${client[data].MasterFiles.Customer.CompanyName}"`)
            countPercentage = (salesPerClient[i].clientPurchases / totalCount) * 100;
            percent.push( +(Math.round(countPercentage * 100) / 100).toFixed(1) )
            break;
        }
    }

    res.json({
        cities,
        count,
        customer,
        percent
    })
}

//Get expenditure by costumer
const getTableCustomer = async (req, res, next) => {
    const salesPerClient = await saft.aggregate([{ $match: { 'Header.FiscalYear': +req.body.FiscalYear } },
    { $unwind: '$SourceDocuments.SalesInvoices.Invoice' },
    {
        $group: {
            '_id': '$SourceDocuments.SalesInvoices.Invoice.CustomerID',
            'ClientTotal': { $sum: '$SourceDocuments.SalesInvoices.Invoice.DocumentTotals.GrossTotal' },
            'ClientAverage': { $avg: '$SourceDocuments.SalesInvoices.Invoice.DocumentTotals.GrossTotal' },
            'clientCount': { $sum: 1 }
        }
    },
    { $sort: { '_id': -1 } }
    ]).catch(next)

    /*clientID = salesPerClient[data]._id;
    console.log(clientID) */
    const client = await saft.aggregate([
        { $unwind: '$MasterFiles.Customer' },
        {
            $project: {
                'MasterFiles.Customer.CustomerTaxID': 1,
                'MasterFiles.Customer.CompanyName': 1,
                'MasterFiles.Customer.CustomerID': 1
            }
        },
        { $sort: { '_id': -1 } }
    ]).catch(next)

    // const stringified = JSON.stringify(client);
    // const obj = JSON.parse(stringified);
    let clientSales = [], clientTotal, clientAverage, clientTaxID, clientName;
    for (data in client) {
        for (i in salesPerClient)
        if (client[data].MasterFiles.Customer.CustomerID == salesPerClient[i]._id) {
            clientTaxID = client[data].MasterFiles.Customer.CustomerTaxID;
            clientName = client[data].MasterFiles.Customer.CompanyName;
            clientTotal = salesPerClient[i].ClientTotal;
            clientAverage = salesPerClient[i].ClientAverage;
            clientSales.push({ clientTaxID, clientName, clientTotal, clientAverage })
            break;
        }
    }

    res.json(
        clientSales
    );
}

// ## DEPRECATED
// const getProducts = async (req, res, next) => {
//     const productsJson = await saft.aggregate([
//     { $match: { 'Header.FiscalYear': +req.body.FiscalYear } },
//     { $unwind: '$MasterFiles.Product' },
//     { $project: {
//             'MasterFiles.Product.ProductCode': 1,
//             'MasterFiles.Product.ProductDescription': 1,
//             'MasterFiles.Product.ProductGroup': 1
//     }}]).catch(next)
//     // const stringified = JSON.stringify(productsJson);
//     // const obj = JSON.parse(stringified);
//     let products = []
//     let ProductCode
//     let ProductDescription
//     let ProductGroup
//     for (i in productsJson) {
//         ProductCode = productsJson[i].MasterFiles.Product.ProductCode;
//         ProductDescription = productsJson[i].MasterFiles.Product.ProductDescription;
//         ProductGroup = productsJson[i].MasterFiles.Product.ProductGroup;
//         products.push({ ProductCode, ProductDescription, ProductGroup })
//     }
//     res.json(products)
// }

const getTableProductSales = async (req, res, next) => {
    const salesPerProduct = await saft.aggregate([{ $match: { 'Header.FiscalYear': +req.body.FiscalYear } },
    { $unwind: { "path": '$SourceDocuments.SalesInvoices.Invoice' } },
    { $unwind: { "path": '$SourceDocuments.SalesInvoices.Invoice.Line' } },
    { $unwind: { "path": '$SourceDocuments.SalesInvoices.Invoice.Line.ProductCode' } },
    {
        $group: {
            '_id': '$SourceDocuments.SalesInvoices.Invoice.Line.ProductCode',
            'ProductDesc': { $addToSet: '$SourceDocuments.SalesInvoices.Invoice.Line.Description' },
            'ProductTotal': { $sum: '$SourceDocuments.SalesInvoices.Invoice.Line.CreditAmount' },
            'ProductAverage': { $avg: '$SourceDocuments.SalesInvoices.Invoice.Line.CreditAmount' },
            'productCount': { $sum: 1 }
        }
    },
    { $sort: { 'ProductTotal': -1 } }
    ]).catch(next)

    let products = [];
    let productDesc;
    let productTotal;
    let productAverage
    let productCount;

    for (i in salesPerProduct) {
        productDesc = salesPerProduct[i].ProductDesc[0];
        productTotal = salesPerProduct[i].ProductTotal;
        productAverage = (Math.round(salesPerProduct[i].ProductAverage * 100) / 100).toFixed(2);
        productCount = salesPerProduct[i].productCount;
        products.push({ productDesc, productTotal, productAverage, productCount })
    }

    res.json(
        products
    );
}

const getPieChartProductGroupSales = async (req, res, next) => {
    const salesPerProduct = await saft.aggregate([{ $match: { 'Header.FiscalYear': +req.body.FiscalYear } },
    { $unwind: { "path": '$SourceDocuments.SalesInvoices.Invoice' } },
    { $unwind: { "path": '$SourceDocuments.SalesInvoices.Invoice.Line' } },
    { $unwind: { "path": '$SourceDocuments.SalesInvoices.Invoice.Line.ProductCode' } },
    {
        $group: {
            '_id': '$SourceDocuments.SalesInvoices.Invoice.Line.ProductCode',
            'ProductTotal': { $sum: '$SourceDocuments.SalesInvoices.Invoice.Line.CreditAmount' },
            'productCount': { $sum: 1 }
        }
    }
    ]).catch(next)

    let products = [];
    let productTotal = [];
    let productCount = [];

    for (i in salesPerProduct) {
        products.push({ 'ID': salesPerProduct[i]._id });
        productTotal.push(salesPerProduct[i].ProductTotal);
        productCount.push(salesPerProduct[i].productCount);
        // console.log(products[i])
    }

    const groups = await saft.aggregate([{ $match: { 'Header.FiscalYear': +req.body.FiscalYear } },
    { $unwind: '$MasterFiles.Product' },
    {
        $group: {
            '_id': '$MasterFiles.Product.ProductGroup',
            'ProductCodes': { $addToSet: '$MasterFiles.Product.ProductCode' }
        }
    },
    { $sort: { '_id': 1 } }
    ]).catch(next)

    let groupName = [];
    let groupTotal = [];
    let groupCount = [];
    let pindex, product;

    for (i in groups) {
        groupTotal[i] = 0;
        groupCount[i] = 0
    }

    for (i in groups) {
        groupName.push(`"${groups[i]._id}"`)

        for (j in products) {
            product = products[j].ID;
            if (groups[i].ProductCodes.includes(product)) {
                pindex = products.findIndex(p => p.ID === product);
                if (pindex != 1) {
                    groupTotal[i] += productTotal[pindex];
                    groupCount[i] += productCount[pindex];
                }
            }
        }
    }

    for (let i = 0; i < groupName.length; i++) {
        if (groupCount[i] === 0) {
            groupName.splice(i, 1);
            groupCount.splice(i, 1);
            groupTotal.splice(i, 1);
        }
    }

    res.json({
        groupName,
        groupTotal,
        groupCount
    });
}

//Search for a Client/Customer using its ID
const getClientInfo = async (req, res, next) => {
    const clientInfo = await saft.find({ 'Header.FiscalYear': +req.body.FiscalYear, 'MasterFiles.Customer.CustomerTaxID': req.params.id },
        { 'MasterFiles.Customer.$': 1 }).catch(next);
    res.json(clientInfo)
}

//Search for a Supplier using its ID
const getSupplierInfo = async (req, res, next) => {
    const requestInfo = await saft.find({ 'Header.FiscalYear': +req.body.FiscalYear, 'MasterFiles.Supplier.SupplierID': req.params.id },
        { 'MasterFiles.Supplier.$': 1 }).catch(next);
    res.json(requestInfo)
}

//Search for a product using its ID
const getProductInfo = async (req, res, next) => {
    const productInfo = await saft.find({ 'Header.FiscalYear': +req.body.FiscalYear, 'MasterFiles.Product.ProductCode': req.params.id },
        { 'MasterFiles.Product.$': 1 }).catch(next)
    res.json(productInfo);
}

const getCompanyInfo = async (req, res) => {
    const companyInfo = await saft.find({ 'AuditFile.Header.FiscalYear': +req.body.FiscalYear },
        { '$project': { 'info': AuditFile.Header } })
}

const getJSON = async (req, res, next) => {
    /*const found = await saft.find().exec((err, collection) => {
        if (err) {
            console.log('Error:', err);
        } else {
            res.json(collection);
        }
    }); */

    const found = await saft.find().catch(next);

    if (found) {
        res.json(found)
    } else {
        console.log("Is null");
    }
};

module.exports = {
    // HOME
    getKpiInfo,
    getDiagramInvoices,
    getTableInvoices,
    // CLIENT
    getPieChartCustomer,
    getTableCustomer,
    // PRODUCT
    // getProducts, # DEPRECATED
    getTableProductSales,
    getPieChartProductGroupSales,
    // MISC
    getClientInfo,
    getSupplierInfo,
    getProductInfo,
    getCompanyInfo,
    getJSON
}