const mongoose = require('mongoose');
const saft = require('../models/Saft');

const getCompanyInfo = async (req, res) => {
    const companyInfo = await saft.find({ 'AuditFile.Header.FiscalYear': +req.body.FiscalYear },
        { '$project': { 'info': AuditFile.Header } })
}

const getJSON = async (req, res) => {
    /*const found = await saft.find().exec((err, collection) => {
        if (err) {
            console.log('Error:', err);
        } else {
            res.json(collection);
        }
    }); */

    const found = await saft.find();
    const stringified = JSON.stringify(found);
    const obj = JSON.parse(stringified);
    console.log(obj[0].Header.FiscalYear.length)

    if (found != null) {
        res.json(found)
    } else {
        console.log("Is null");
    }
};

//Retorna informação referente a cada Movimentação: Ou seja, valores de  compras() e vendas(organizadas por período)
const getInfo = async (req, res) => {

    console.log(req.body.FiscalYear)

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
    )

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

//Search for a Client/Customer using its ID
const getClientInfo = async (req, res) => {
    const clientInfo = await saft.find({ 'Header.FiscalYear': +req.body.FiscalYear, 'MasterFiles.Customer.CustomerTaxID': req.params.id },
        { 'MasterFiles.Customer.$': 1 })
    res.json(clientInfo)
}

//Search for a Supplier using its ID
const getSupplierInfo = async (req, res) => {
    const requestInfo = await saft.find({ 'Header.FiscalYear': +req.body.FiscalYear, 'MasterFiles.Supplier.SupplierID': req.params.id },
        { 'MasterFiles.Supplier.$': 1 })
    res.json(requestInfo)
}

//Get all Invoices
const getInvoices = async (req, res) => {
    const invoices = await saft.aggregate([{ $match: { 'Header.FiscalYear': +req.body.FiscalYear } },
    {$unwind: '$SourceDocuments.SalesInvoices.Invoice'},
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
    ])
    const stringified = JSON.stringify(invoices);
    const obj = JSON.parse(stringified);
    let invoiceInfo = []

    let InvoiceNo;
    let InvoiceDate;
    let CustomerID;
    let GrossTotal;
    let NetTotal;
    let TaxTotal;
    const NumberOfEntries = obj[0].SourceDocuments.SalesInvoices.NumberOfEntries;
    console.log(obj[0])
    for (let i = 0; i < NumberOfEntries; i++) {
        InvoiceNo = obj[i].SourceDocuments.SalesInvoices.Invoice.InvoiceNo;
        InvoiceDate = obj[i].SourceDocuments.SalesInvoices.Invoice.InvoiceDate;
        CustomerID = obj[i].SourceDocuments.SalesInvoices.Invoice.CustomerID;
        GrossTotal = obj[i].SourceDocuments.SalesInvoices.Invoice.DocumentTotals.GrossTotal;
        NetTotal = obj[i].SourceDocuments.SalesInvoices.Invoice.DocumentTotals.NetTotal;
        TaxTotal = GrossTotal - NetTotal;
        invoiceInfo.push({ InvoiceNo, InvoiceDate, CustomerID, GrossTotal, NetTotal, TaxTotal })
    }
    res.json(invoiceInfo)
}

const getClientLocations = async (req, res) => {
    const clientPerLocation = await saft.aggregate([{ $match: { 'Header.FiscalYear': +req.body.FiscalYear } },
    { $unwind: '$MasterFiles.Customer' },
    {
        $group: {
            '_id': '$MasterFiles.Customer.BillingAddress.City',
            'locationCount': { $sum: 1 }
        }
    }
    ])

    let cities = [];
    let count = [];

    for (data in clientPerLocation) {
        cities.push(clientPerLocation[data]._id);
        count.push(clientPerLocation[data].locationCount);
    }

    res.json({
        cities,
        count
    })

}

//Get expenditure by costumer
const getSales = async (req, res) => {
    const salesPerClient = await saft.aggregate([{ $match: { 'Header.FiscalYear': +req.body.FiscalYear } },
    { $unwind: '$SourceDocuments.SalesInvoices.Invoice' },
    {
        $group: {
            '_id': '$SourceDocuments.SalesInvoices.Invoice.CustomerID',
            'ClientTotal': { $sum: '$SourceDocuments.SalesInvoices.Invoice.DocumentTotals.GrossTotal' },
            'ClientAverage': { $avg: '$SourceDocuments.SalesInvoices.Invoice.DocumentTotals.GrossTotal' },
            'clientCount': { $sum: 1 }
        }
    }
    ])

    let clientSales = []
    let clientTotal;
    let clientAverage;
    let clientCount;
    let clientTaxID;
    let clientName;

    /*clientID = salesPerClient[data]._id;
    console.log(clientID) */
    const client = await saft.aggregate([
        { $unwind: '$MasterFiles.Customer' },
        {
            $project: {
                'MasterFiles.Customer.CustomerTaxID': 1,
                'MasterFiles.Customer.CompanyName': 1
            }
        }
    ])

    const stringified = JSON.stringify(client);
    const obj = JSON.parse(stringified);
    for (data in salesPerClient) {
        clientTaxID = obj[data].MasterFiles.Customer.CustomerTaxID;
        clientName = obj[data].MasterFiles.Customer.CompanyName;
        clientTotal = salesPerClient[data].ClientTotal;
        clientAverage = salesPerClient[data].ClientAverage;
        clientCount = salesPerClient[data].clientCount;
        clientSales.push({ clientTaxID, clientName, clientTotal, clientAverage, clientCount })
    }

    res.json(
        clientSales
    );

}

const getProducts = async (req, res) => {
    const productsJson = await saft.aggregate([{ $match: { 'Header.FiscalYear': +req.body.FiscalYear } },
    { $unwind: '$MasterFiles.Product' },
    {
        $project: {
            'MasterFiles.Product.ProductCode': 1,
            'MasterFiles.Product.ProductDescription': 1,
            'MasterFiles.Product.ProductGroup': 1
        }
    }

    ])
    
    const stringified = JSON.stringify(productsJson);
    const obj = JSON.parse(stringified);

    let products = []
    let ProductCode
    let ProductDescription
    let ProductGroup
    for (i in productsJson) {
        ProductCode = obj[i].MasterFiles.Product.ProductCode;
        ProductDescription = obj[i].MasterFiles.Product.ProductDescription;
        ProductGroup = obj[i].MasterFiles.Product.ProductGroup;
        products.push({ ProductCode, ProductDescription, ProductGroup })
    }

    res.json(products)

}

const getProductSales = async (req, res) => {
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
    ])

    let products = [];
    let productDesc;
    let productTotal;
    let productAverage
    let productCount;

    for (i in salesPerProduct) {
        productDesc = salesPerProduct[i].ProductDesc[0];
        productTotal = salesPerProduct[i].ProductTotal;
        productAverage = salesPerProduct[i].ProductAverage;
        productCount = salesPerProduct[i].productCount;
        products.push({productDesc, productTotal, productAverage, productCount})
    }

    res.json(
        products
    );

}

const getGroupSales = async (req, res) => {
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
    ])

    let products = [];
    let productTotal = [];
    let productCount = [];


    for (i in salesPerProduct) {

        products.push({ 'ID': salesPerProduct[i]._id });
        productTotal.push(salesPerProduct[i].ProductTotal);
        productCount.push(salesPerProduct[i].productCount);
        console.log(products[i])
    }

    const groups = await saft.aggregate([{ $match: { 'Header.FiscalYear': +req.body.FiscalYear} },
    { $unwind: '$MasterFiles.Product' },
    {
        $group: {
            '_id': '$MasterFiles.Product.ProductGroup',
            'ProductCodes': { $addToSet: '$MasterFiles.Product.ProductCode' }
        }
    },
    { $sort: { '_id': 1 } }
    ])

    let groupName = [];
    let groupTotal = [];
    let groupCount = [];
    let pindex;

    for(i in groups){
        groupTotal[i] = 0;
        groupCount[i] = 0
    }

    for(i in groups){
        groupName.push(`"${groups[i]._id}"`)

        for(j in products){
            product = products[j].ID;
            if(groups[i].ProductCodes.includes(product)){
                pindex = products.findIndex(p => p.ID === product);
                if(pindex!=1){
                    groupTotal[i] += productTotal[pindex];
                    groupCount[i] += productCount[pindex];
                }
            }
        }
    }


    res.json({
        groupName,
        groupTotal,
        groupCount
    });

}

const getValues = async (req, res) => {
    const movimentsInfo = await saft.aggregate([{ $match: { 'Header.FiscalYear': +req.body.FiscalYear } },
    {
        $project: {
            'SourceDocuments.SalesInvoices.NumberOfEntries': 1,
            'SourceDocuments.SalesInvoices.TotalCredit': 1,
            'GeneralLedgerEntries.NumberOfEntries': 1,
            'GeneralLedgerEntries.TotalCredit': 1
        }
    }
    ])

    const stringified = JSON.stringify(movimentsInfo);
    const obj = JSON.parse(stringified);

    const TotalEntries = obj[0].GeneralLedgerEntries.NumberOfEntries;
    const TotalCredit = obj[0].GeneralLedgerEntries.TotalCredit;
    const NumberOfSales = obj[0].SourceDocuments.SalesInvoices.NumberOfEntries;
    const SalesValue = obj[0].SourceDocuments.SalesInvoices.TotalCredit;

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
    {$sort:{_id:1}}
])

    const stringifiedTotals = JSON.stringify(jsonTotalSalesAndPurchases);
    const obj2 = JSON.parse(stringifiedTotals);
    console.log(obj2)
    const totalCompras = obj2[0].Total;
    const totalVendas = obj2[1].Total;


    res.json({
        TotalEntries: TotalEntries,
        TotalCredit: TotalCredit,
        NumberOfSales: NumberOfSales,
        SalesValue: SalesValue,
        totalCompras: totalCompras,
        totalVendas: totalVendas
    })
}

//Search for a product using its ID
const getProductInfo = async (req, res) => {
    const productInfo = await saft.find({ 'Header.FiscalYear': +req.body.FiscalYear, 'MasterFiles.Product.ProductCode': req.params.id },
        { 'MasterFiles.Product.$': 1 })

    res.json(productInfo);
}

module.exports = {
    getCompanyInfo,
    getInfo,
    getJSON,
    getClientInfo,
    getSupplierInfo,
    getInvoices,
    getSales,
    getProductInfo,
    getValues,
    getClientLocations,
    getProductSales,
    getProducts,
    getGroupSales
}