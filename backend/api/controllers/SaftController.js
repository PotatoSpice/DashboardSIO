const mongoose = require('mongoose');
const saft = require('../models/Saft');

const getCompanyInfo = async (req, res) => {
    const companyInfo = await saft.find({ 'AuditFile.Header.FiscalYear': req.body.FiscalYear },
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
    const jsonInvoicesMonth = await saft.aggregate([{ $match: { 'Header.FiscalYear': req.body.FiscalYear } },
    { $unwind: '$SourceDocuments.SalesInvoices.Invoice' },
    {
        $group: {
            '_id': '$SourceDocuments.SalesInvoices.Invoice.Period',
            'MonthTotal': { $sum: '$SourceDocuments.SalesInvoices.Invoice.DocumentTotals.GrossTotal' }, //Com Impostos
            'MonthNetTotal': { $sum: '$SourceDocuments.SalesInvoices.Invoice.DocumentTotals.NetTotal' } //Sem, Impostos
        }
    },
    { $sort: { '_id': 1 } }
    ]
    )

    //Retorna o total de Compras(index 1) e Vendas (index 0)
    const jsonTotalSalesAndPurchases = await saft.aggregate([{ $match: { 'Header.FiscalYear': req.body.FiscalYear } },
    { $unwind: '$GeneralLedgerEntries.Journal' },
    {
        $group: {
            '_id': '$GeneralLedgerEntries.Journal.Description',
            'Total': { $sum: '$GeneralLedgerEntries.Journal.Transaction.Lines.CreditLine.CreditAmount' },
        }
    },
    ])

    res.json({
        totalSalesAndPurchases: jsonTotalSalesAndPurchases,
        invoicesMonth: jsonInvoicesMonth
    })
}

//Search for a Client/Customer using its ID
const getClientInfo = async (req, res) => {
    const clientInfo = await saft.find({ 'Header.FiscalYear': req.body.FiscalYear, 'MasterFiles.Customer.CustomerTaxID': req.params.id },
        { 'MasterFiles.Customer.$': 1 })
    res.json(clientInfo)
}

//Search for a Supplier using its ID
const getSupplierInfo = async (req, res) => {
    const requestInfo = await saft.find({ 'Header.FiscalYear': req.body.FiscalYear, 'MasterFiles.Supplier.SupplierID': req.params.id },
        { 'MasterFiles.Supplier.$': 1 })
    res.json(requestInfo)
}

//Get all Invoices
const getInvoices = async (req, res) => {
    const invoices = await saft.aggregate([{ $match: { 'Header.FiscalYear': req.body.FiscalYear } },
    {
        $project: {
            'SourceDocuments.SalesInvoices.Invoice.InvoiceNo': 1,
            'SourceDocuments.SalesInvoices.Invoice.InvoiceDate': 1,
            'SourceDocuments.SalesInvoices.Invoice.CustomerID': 1,
            'SourceDocuments.SalesInvoices.Invoice.DocumentTotals.GrossTotal': 1,
            'SourceDocuments.SalesInvoices.Invoice.DocumentTotals.NetTotal': 1
        }
    },


    ])
    res.json(invoices)
}

//Get expenditure by costumer
const getSales = async (req, res) => {
    const salesPerClient = await saft.aggregate([{ $match: { 'Header.FiscalYear': req.body.FiscalYear } },
    { $unwind: '$SourceDocuments.SalesInvoices.Invoice' },
    {
        $group: {
            '_id': '$SourceDocuments.SalesInvoices.Invoice.CustomerID',
            'ClientTotal': { $sum: '$SourceDocuments.SalesInvoices.Invoice.DocumentTotals.GrossTotal' },
            'ClientNetTotal': { $sum: '$SourceDocuments.SalesInvoices.Invoice.DocumentTotals.NetTotal' },
            'clientCount': { $sum: 1 }
        }
    }
    ])

    res.json(
        salesPerClient
    );

}

const getValues = async (req, res) => {
    const movimentsInfo = await saft.aggregate([{ $match: { 'Header.FiscalYear': '2017' } },
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
    const jsonTotalSalesAndPurchases = await saft.aggregate([{ $match: { 'Header.FiscalYear': '2017' } },
    { $unwind: '$GeneralLedgerEntries.Journal' },
    {
        $group: {
            '_id': '$GeneralLedgerEntries.Journal.Description',
            'Total': { $sum: '$GeneralLedgerEntries.Journal.Transaction.Lines.CreditLine.CreditAmount' },
        }
    },
    ])

    const stringifiedTotals = JSON.stringify(jsonTotalSalesAndPurchases);
    const obj2 = JSON.parse(stringifiedTotals);

    const totalCompras = obj2[0].Total;
    const totalVendas = obj2[0].Total;

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
    const productInfo = await saft.find({ 'Header.FiscalYear': req.body.FiscalYear, 'MasterFiles.Product.ProductCode': req.params.id },
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
}