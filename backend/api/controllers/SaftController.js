const mongoose = require('mongoose');
const saft = require('../models/Saft');

const getCompanyInfo = async (req, res) => {
    const companyInfo = await saft.find({ 'AuditFile.Header.FiscalYear': req.body.FiscalYear }, 
    {'$project': {'info': AuditFile.Header }})
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

    if (found != null) {
        res.json(found)
    } else {
        console.log("Is null");
    }
};

//Retorna informação referente a cada Movimentação: Ou seja, valores de  compras() e vendas(organizadas por período)
const getInfo = async (req, res) => {

    const jsonInvoicesMonth = await saft.find({ 'AuditFile.Header.FiscalYear': req.body.FiscalYear }, {
        '$expr': {
            '$group': {
                'Period': '$AuditFile.SourceDocuments.SalesInvoices.Invoice.Period',
                'MonthTotal': { '$sum': '$AuditFile.SourceDocuments.SalesInvoices.Invoice.DocumentTotals.GrossTotal' },
                'MonthNetTotal': { '$sum': '$AuditFile.SourceDocuments.SalesInvoices.Invoice.DocumentTotals.NetTotal' }
            },
            '$sort': {
                'Period': 1
            }

        }
    });

    const jsonTotalPurchases = await saft.find({ 'AuditFile.Header.FiscalYear': req.body.FiscalYear },
        { 'AuditFile.GeneralLedgerEntries': { '$slice': [3, 1] } }, {
        '$expr': {
            '$group': {
                'Journal': 'AuditFile.GeneralLedgerEntries.Journal',
                'PurchaseTotal': { '$sum': '$AuditFile.GeneralLedgerEntries.Journal.Transaction.Lines.CreditLine.CreditAmount' },
            },
        }
    });

    res.json(
        jsonTotalPurchases,
        jsonInvoicesMonth)
}

//Search for a Client/Customer using its ID
const getClientInfo = async (req, res) => {
    const clientInfo = await saft.find({ 'AuditFile.Header.FiscalYear': req.body.FiscalYear, 'AuditFile.MasterFiles.Customer.CustomerID': req.params.id })
    res.json( clientInfo)
}

//Search for a Supplier using its ID
const getSupplierInfo = async (req, res) => {
    const requestInfo = await saft.find({ 'AuditFile.Header.FiscalYear': req.body.FiscalYear, 'AuditFile.MasterFiles.Supplier.SupplierID': req.params.id })
    res.json( requestInfo )
}

//Search for a specific invoice using its ID (shares all information)
const getInvoice = async (req, res) => {
    const invoiceInfo = await saft.find({ 'AuditFile.Header.FiscalYear': req.body.FiscalYear, 'AuditFile.SourceDocuments.SalesInvoices.Invoice.InvoiceNo': req.params.id })
    res.json( invoiceInfo )
}

//Get all Invoices
const getInvoices = async (req, res) => {
    const invoices = await saft.find({ 'AuditFile.Header.FiscalYear': req.body.FiscalYear },
        { 'AuditFile.SourceDocuments.SalesInvoices': { '$slice': [3, -1] } })
    res.json( invoices )
}

//Get expenditure by costumer
const getSales = async (req, res) => {
    const salesPerClient = await saft.find({ 'AuditFile.Header.FiscalYear': req.body.FiscalYear },
        {
            '$expr': {
                '$group': {
                    'Customer': '$AuditFile.SourceDocuments.SalesInvoices.Invoice.CustomerID',
                    'ClientTotal': { '$sum': '$AuditFile.SourceDocuments.SalesInvoices.Invoice.DocumentTotals.GrossTotal' },
                    'ClientNetTotal': { '$sum': '$AuditFile.SourceDocuments.SalesInvoices.Invoice.DocumentTotals.NetTotal' }
                }
            }
        })
    res.json(
        salesPerClient
    );

}

//Search for a product using its ID
const getProductInfo = async (req, res) => {
    const productInfo = await saft.find({ 'AuditFile.Header.FiscalYear': req.body.FiscalYear, 'AuditFile.MasterFiles.Product.ProductCode': req.body.id },
        {
            '$project': {'Products': 'AuditFile.MasterFiles.Product'}
        })
    res.json(
        productInfo
    );
}

module.exports = {
    getCompanyInfo,
    getInfo,
    getJSON,
    getClientInfo,
    getSupplierInfo,
    getInvoice,
    getInvoices,
    getSales,
    getProductInfo,
}