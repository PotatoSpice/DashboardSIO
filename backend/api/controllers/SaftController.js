const mongoose = require('mongoose');
const saft = require('../models/Saft');

const parseFile = async (req, res) => {

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

const getInfo = async (req, res) => {
    const found = await saft.find();

    if (found != null) {
        const stringified = JSON.stringify(found);
        const obj = JSON.parse(stringified)

        const companyName = obj[0].AuditFile.Header.CompanyName;
        const clients = object[0].AuditFile.MasterFiles.Customer;
        const suppliers = object[0].AuditFile.MasterFiles.Supplier;
        const date = object[0].AuditFile.Header.FiscalYear;
        const numberOfClients = clients.length;
        var clients = [];
        const numberOfSales = object[0].AuditFile.SourceDocuments.SalesInvoices.NumberOfEntries;
        const numberOfSuppliers = suppliers.length;
        var suppliers = [];
        const numberOfSales = object[0].AuditFile.SourceDocuments.SalesInvoices.NumberOfEntries;
        const invoices = object[0].AuditFile.SourceDocuments.SalesInvoices;
        const totalEntries = object[0].AuditFile.GeneralLedgerEntries.NumberOfEntries;
        const totalCredit = parseInt(object[0].AuditFile.SourceDocuments.SalesInvoices.TotalCredit);

        var totalSales = [];
        var months = [];
        var monthsTotal = [];
        var monthsNet = [];

        for (let i = 0; i < numberOfClients; i++) {
            clients[i] = object[0].AuditFile.MasterFiles.Customer[i];
        }

        for (let i = 0; i < numberOfSuppliers; i++) {
            suppliers[i] = object[0].AuditFile.MasterFiles.Supplier[i];
        }

        for (let i = 0; i < numberOfSales; i++) {
            months[i] = 0;
            monthsTotal[i] = 0;
            monthsNet[i] = 0;
            totalSales[i] = object[0].AuditFile.SourceDocuments.SalesInvoices.Invoice[i].DocumentTotals.GrossTotal;
        }

        for (let i = 0; i < numberOfSales; i++) {
            switch (month.Invoice[i].Period) {
                case '01':
                    monthTotalArray[month.Invoice[i].Period - 1]
                        += parseFloat(grossTotal.Invoice[i].DocumentTotals.GrossTotal);
                    monthNetArray[month.Invoice[i].Period - 1]
                        += parseFloat(grossTotal.Invoice[i].DocumentTotals.NetTotal);
                    monthArray[month.Invoice[i].Period - 1]++;
                    break;
                case '02':
                    monthTotalArray[month.Invoice[i].Period - 1]
                        += parseFloat(grossTotal.Invoice[i].DocumentTotals.GrossTotal);
                    monthNetArray[month.Invoice[i].Period - 1]
                        += parseFloat(grossTotal.Invoice[i].DocumentTotals.NetTotal);
                    monthArray[month.Invoice[i].Period - 1]++;
                    break;
                case '03':
                    monthTotalArray[month.Invoice[i].Period - 1]
                        += parseFloat(grossTotal.Invoice[i].DocumentTotals.GrossTotal);
                    monthNetArray[month.Invoice[i].Period - 1]
                        += parseFloat(grossTotal.Invoice[i].DocumentTotals.NetTotal);
                    monthArray[month.Invoice[i].Period - 1]++;
                    break;
                case '04':
                    monthTotalArray[month.Invoice[i].Period - 1]
                        += parseFloat(grossTotal.Invoice[i].DocumentTotals.GrossTotal);
                    monthNetArray[month.Invoice[i].Period - 1]
                        += parseFloat(grossTotal.Invoice[i].DocumentTotals.NetTotal);
                    monthArray[month.Invoice[i].Period - 1]++;
                    break;
                case '05':
                    monthTotalArray[month.Invoice[i].Period - 1]
                        += parseFloat(grossTotal.Invoice[i].DocumentTotals.GrossTotal);
                    monthNetArray[month.Invoice[i].Period - 1]
                        += parseFloat(grossTotal.Invoice[i].DocumentTotals.NetTotal);
                    monthArray[month.Invoice[i].Period - 1]++;
                    break;
                case '06':
                    monthTotalArray[month.Invoice[i].Period - 1]
                        += parseFloat(grossTotal.Invoice[i].DocumentTotals.GrossTotal);
                    monthNetArray[month.Invoice[i].Period - 1]
                        += parseFloat(grossTotal.Invoice[i].DocumentTotals.NetTotal);
                    monthArray[month.Invoice[i].Period - 1]++;
                    break;
                case '07':
                    monthTotalArray[month.Invoice[i].Period - 1]
                        += parseFloat(grossTotal.Invoice[i].DocumentTotals.GrossTotal);
                    monthNetArray[month.Invoice[i].Period - 1]
                        += parseFloat(grossTotal.Invoice[i].DocumentTotals.NetTotal);
                    monthArray[month.Invoice[i].Period - 1]++;
                    break;
                case '08':
                    monthTotalArray[month.Invoice[i].Period - 1]
                        += parseFloat(grossTotal.Invoice[i].DocumentTotals.GrossTotal);
                    monthNetArray[month.Invoice[i].Period - 1]
                        += parseFloat(grossTotal.Invoice[i].DocumentTotals.NetTotal);
                    monthArray[month.Invoice[i].Period - 1]++;
                    break;
                case '09':
                    monthTotalArray[month.Invoice[i].Period - 1]
                        += parseFloat(grossTotal.Invoice[i].DocumentTotals.GrossTotal);
                    monthNetArray[month.Invoice[i].Period - 1]
                        += parseFloat(grossTotal.Invoice[i].DocumentTotals.NetTotal);
                    monthArray[month.Invoice[i].Period - 1]++;
                    break;
                case '10':
                    monthTotalArray[month.Invoice[i].Period - 1]
                        += parseFloat(grossTotal.Invoice[i].DocumentTotals.GrossTotal);
                    monthNetArray[month.Invoice[i].Period - 1]
                        += parseFloat(grossTotal.Invoice[i].DocumentTotals.NetTotal);
                    monthArray[month.Invoice[i].Period - 1]++;
                    break;
                case '11':
                    monthTotalArray[month.Invoice[i].Period - 1]
                        += parseFloat(grossTotal.Invoice[i].DocumentTotals.GrossTotal);
                    monthNetArray[month.Invoice[i].Period - 1]
                        += parseFloat(grossTotal.Invoice[i].DocumentTotals.NetTotal);
                    monthArray[month.Invoice[i].Period - 1]++;
                    break;
                case '12':
                    monthTotalArray[month.Invoice[i].Period - 1]
                        += parseFloat(grossTotal.Invoice[i].DocumentTotals.GrossTotal);
                    monthNetArray[month.Invoice[i].Period - 1]
                        += parseFloat(grossTotal.Invoice[i].DocumentTotals.NetTotal);
                    monthArray[month.Invoice[i].Period - 1]++;
                    break;
            }
        }

        const productsTam = object[0].AuditFile.MasterFiles.Product.length;
        var products = [];

        for (let i = 1; i < productsTam; i++) {
            products[i - 1] = object[0].AuditFile.MasterFiles.Product[i];
        }

        const totalEntries = object[0].AuditFile.GeneralLedgerEntries.NumberOfEntries;

        const numberOfPurchases = totalEntries - numberOfSales;

        var purchaseQuantity = [];
        var purchaseValue = [];

        for (let i = 0; i < numberOfPurchases; i++) {
            purchaseQuantity[i] = object[0].AuditFile.GeneralLedgerEntries.Journal[0].Transaction[i].Line.length;
        }

        for (let i = 2; j < numberOfPurchases; j++) {
            purchaseValue[j] = parseInt(object[0].AuditFile.GeneralLedgerEntries.Journal[0].Transaction[j].Line[0].CreditAmount);
        }

        var totalPurchased = 0;

        for (let i = 2; i < purchaseValue.length; i++) {
            totalPurchased += purchaseValue[i];
        }
        //Insert view here
        res.render("", {
            companyName: companyName,
            numberOfClients: numberOfClients,
            numberOfSales: numberOfSales,
            numberOfSuppliers: numberOfSuppliers,
            numberOfPurchases: numberOfPurchases,
            months: months,
            monthsTotal: monthsTotal,
            monthsNet: monthsNet,
            totalCredit: totalCredit,
            costumers: clients,
            totalPurchased: totalPurchased,
            suppliers: suppliers,
            products: products,
            date: date,
        })
    }
}

//Search for a Client/Customer using its ID
const getClientInfo = async (req, res) => {

}

const getSupplierInfo = async (req, res) => {

}

//Search for a specific invoice using its ID
const getInvoice = async (req, res) => {

}

const getInvoices = async (req, res) => {

}

//Get all the Sales
const getSales = async (req, res) => {

}

const getProductInfo = async (req, res) => {

}



module.exports = {
    parseFile,
    getInfo,
    getJSON,
    getClientInfo,
    getSupplierInfo,
    getInvoice,
    getInvoices,
    getSales,
    getProductInfo
}