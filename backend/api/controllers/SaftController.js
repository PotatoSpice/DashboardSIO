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
    const jsonInvoicesMonth = await saft.aggregate([{ $match: { 'doc.AuditFile.Header.FiscalYear': req.body.FiscalYear } },
    { $unwind: '$doc.AuditFile.SourceDocuments.SalesInvoices.Invoice' },
    {
        $group: {
            '_id': '$doc.AuditFile.SourceDocuments.SalesInvoices.Invoice.Period',
            'MonthTotal': { $sum: '$doc.AuditFile.SourceDocuments.SalesInvoices.Invoice.DocumentTotals.GrossTotal' }, //Com Impostos
            'MonthNetTotal': { $sum: '$doc.AuditFile.SourceDocuments.SalesInvoices.Invoice.DocumentTotals.NetTotal' } //Sem, Impostos
        }
    },
    { $sort: { '_id': 1 } }
    ]
    )

    let months = [];
    let monthTotal = [];
    let monthNetTotal = [];

    for (data in jsonInvoicesMonth){
        months.push(jsonInvoicesMonth[data]._id);
        monthTotal.push(jsonInvoicesMonth[data].MonthTotal);
        monthNetTotal.push(jsonInvoicesMonth[data].MonthNetTotal)
    }

    console.log(jsonInvoicesMonth);

    res.json({
       months,
       monthTotal,
       monthNetTotal
    })
}

//Search for a Client/Customer using its ID
const getClientInfo = async (req, res) => {
    const clientInfo = await saft.find({ 'doc.AuditFile.Header.FiscalYear': req.body.FiscalYear, 'doc.AuditFile.MasterFiles.Customer.CustomerTaxID': req.params.id },
        { 'doc.AuditFile.MasterFiles.Customer.$': 1 })
    res.json(clientInfo)
}

//Search for a Supplier using its ID
const getSupplierInfo = async (req, res) => {
    const requestInfo = await saft.find({ 'doc.AuditFile.Header.FiscalYear': req.body.FiscalYear, 'doc.AuditFile.MasterFiles.Supplier.SupplierID': req.params.id },
        { 'doc.AuditFile.MasterFiles.Supplier.$': 1 })
    res.json(requestInfo)
}

//Get all Invoices
const getInvoices = async (req, res) => {
    const invoices = await saft.aggregate([{ $match: { 'doc.AuditFile.Header.FiscalYear': req.body.FiscalYear } },
    {
        $project: {
            'doc.AuditFile.SourceDocuments.SalesInvoices.Invoice.InvoiceNo': 1,
            'doc.AuditFile.SourceDocuments.SalesInvoices.Invoice.InvoiceDate': 1,
            'doc.AuditFile.SourceDocuments.SalesInvoices.Invoice.CustomerID': 1,
            'doc.AuditFile.SourceDocuments.SalesInvoices.Invoice.DocumentTotals.GrossTotal': 1,
            'doc.AuditFile.SourceDocuments.SalesInvoices.Invoice.DocumentTotals.NetTotal': 1
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
            '_id': '$doc.AuditFile.SourceDocuments.SalesInvoices.Invoice.CustomerID',
            'ClientTotal': { $sum: '$doc.AuditFile.SourceDocuments.SalesInvoices.Invoice.DocumentTotals.GrossTotal' },
            'ClientNetTotal': { $sum: '$doc.AuditFile.SourceDocuments.SalesInvoices.Invoice.DocumentTotals.NetTotal' },
            'clientCount': { $sum: 1 }
        }
    }
    ])

    res.json(
        salesPerClient
    );

}

const getValues = async (req, res) => {
    const movimentsInfo = await saft.aggregate([{ $match: { 'doc.AuditFile.Header.FiscalYear': req.body.FiscalYear } },
    {
        $project: {
            'doc.AuditFile.SourceDocuments.SalesInvoices.NumberOfEntries': 1,
            'doc.AuditFile.SourceDocuments.SalesInvoices.TotalCredit': 1,
            'doc.AuditFile.GeneralLedgerEntries.NumberOfEntries': 1,
            'doc.AuditFile.GeneralLedgerEntries.TotalCredit': 1
        }
    }
    ])

    const stringified = JSON.stringify(movimentsInfo);
    const obj = JSON.parse(stringified);

    const TotalEntries = obj[0].doc.AuditFile.GeneralLedgerEntries.NumberOfEntries;
    const TotalCredit = obj[0].doc.AuditFile.GeneralLedgerEntries.TotalCredit;
    const NumberOfSales = obj[0].doc.AuditFile.SourceDocuments.SalesInvoices.NumberOfEntries;
    const SalesValue = obj[0].doc.AuditFile.SourceDocuments.SalesInvoices.TotalCredit;

    //Retorna o total de Compras(index 1) e Vendas (index 0)
    const jsonTotalSalesAndPurchases = await saft.aggregate([{ $match: { 'doc.AuditFile.Header.FiscalYear': req.body.FiscalYear } },
    { $unwind: '$doc.AuditFile.GeneralLedgerEntries.Journal' },
    {
        $group: {
            '_id': '$doc.AuditFile.GeneralLedgerEntries.Journal.Description',
            'Total': { $sum: '$doc.AuditFile.GeneralLedgerEntries.Journal.Transaction.Line.CreditLine.CreditAmount' },
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
    const productInfo = await saft.find({ 'doc.AuditFile.Header.FiscalYear': req.body.FiscalYear, 'doc.AuditFile.MasterFiles.Product.ProductCode': req.params.id },
        { 'doc.AuditFile.MasterFiles.Product.$': 1 })

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