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
    try {
        const found = await saft.find();

        if (found != null) {
            const stringified = JSON.stringify(found);
            const obj = JSON.parse(stringified)

            const companyName = obj[0].AuditFile.Header.CompanyName;
            const clients = obj[0].AuditFile.MasterFiles.Customer;
            const suppliers = obj[0].AuditFile.MasterFiles.Supplier;
            const date = obj[0].AuditFile.Header.FiscalYear;
            const numberOfClients = clients.length;
            var clients = [];
            const numberOfSales = obj[0].AuditFile.SourceDocuments.SalesInvoices.NumberOfEntries;
            const numberOfSuppliers = suppliers.length;
            var suppliers = [];
            const numberOfSales = obj[0].AuditFile.SourceDocuments.SalesInvoices.NumberOfEntries;
            const invoices = obj[0].AuditFile.SourceDocuments.SalesInvoices;
            const totalEntries = obj[0].AuditFile.GeneralLedgerEntries.NumberOfEntries;
            const totalCredit = parseInt(obj[0].AuditFile.SourceDocuments.SalesInvoices.TotalCredit);

            var totalSales = [];
            var months = [];
            var monthsTotal = [];
            var monthsNet = [];

            for (let i = 0; i < numberOfClients; i++) {
                clients[i] = obj[0].AuditFile.MasterFiles.Customer[i];
            }

            for (let i = 0; i < numberOfSuppliers; i++) {
                suppliers[i] = obj[0].AuditFile.MasterFiles.Supplier[i];
            }

            for (let i = 0; i < numberOfSales; i++) {
                months[i] = 0;
                monthsTotal[i] = 0;
                monthsNet[i] = 0;
                totalSales[i] = obj[0].AuditFile.SourceDocuments.SalesInvoices.Invoice[i].DocumentTotals.GrossTotal;
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

            const productsTam = obj[0].AuditFile.MasterFiles.Product.length;
            var products = [];

            for (let i = 1; i < productsTam; i++) {
                products[i - 1] = obj[0].AuditFile.MasterFiles.Product[i];
            }

            const totalEntries = obj[0].AuditFile.GeneralLedgerEntries.NumberOfEntries;

            const numberOfPurchases = totalEntries - numberOfSales;

            var purchaseQuantity = [];
            var purchaseValue = [];

            for (let i = 0; i < numberOfPurchases; i++) {
                purchaseQuantity[i] = obj[0].AuditFile.GeneralLedgerEntries.Journal[0].Transaction[i].Line.length;
            }

            for (let i = 2; j < numberOfPurchases; j++) {
                purchaseValue[j] = parseInt(obj[0].AuditFile.GeneralLedgerEntries.Journal[0].Transaction[j].Line[0].CreditAmount);
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
    } catch (e) {
        res.status(404).send(null)
    }
}

//Search for a Client/Customer using its ID
const getClientInfo = async (req, res) => {
    try {
        const info = await saft.find()
        if (info != null) {
            const stringified = JSON.stringify(info);
            const obj = JSON.parse(stringified);
            const clients = obj[0].AuditFile.MasterFiles.Customer;
            var numberOfClients = clients.length;

            var costumer;

            let ix = 0; // não sei se não poderia começar em 1, mas posso estar a perceber mal o conceito
            let found = false;
            while (ix < numberOfClients || found == false) {
                if (clients[i].CustomerID === req.params.id) {
                    costumer = clients[i];
                    found = true;
                }
                ix++;
            }

            res.render("", { costumer: costumer });
        }
    } catch (e) {
        res.status(404).send(null)
    }
}

//Search for a Supplier using its ID
const getSupplierInfo = async (req, res) => {
    try {
        const info = await saft.find()
        if (info != null) {
            const stringified = JSON.stringify(info);
            const obj = JSON.parse(stringified);
            const suppliers = obj[0].AuditFile.MasterFiles.Supplier;
            var numberOfSuppliers = suppliers.length;

            var supplier;

            let ix = 0;
            let found = false;
            while (ix < numberOfSuppliers || found == false) {
                if (suppliers[i].SupplierID === req.params.id) {
                    supplier = suppliers[i];
                    found = true;
                }
                ix++;
            }

            res.render("", { supplier: supplier });
        }
    } catch (e) {
        res.status(404).send(null)
    }
}

//Search for a specific invoice using its ID
const getInvoice = async (req, res) => {
    try {
        const info = await saft.find()
        if (info != null) {
            const stringified = JSON.stringify(info);
            const obj = JSON.parse(stringified);
            const invoiceContent = obj[0].AuditFile.SourceDocuments.SalesInvoices;
            const numberOfEntries = invoiceContent.Invoice.length;

            var invoiceInfo = [];
            var invoiceQuantity = [];
            var wantedIndex = 0;
            var found = false;
            for (let i = 0; i < numberOfEntries; i++) {
                if (invoiceContent.Invoice[i].Line.length === undefined) {
                    invoiceQuantity[i] = 0;
                } else {
                    invoiceQuantity[i] = invoiceContent.Invoice[i].Line.length;
                }
                invoiceInfo[i] = invoiceContent.Invoice[i];
                invoices[i] = invoiceContent.Invoice[i].Line;
                documentTotal[i] = invoiceContent.Invoice[i].DocumentTotals;

                if (invoiceInfo[i].InvoiceNO === req.params.id) {
                    wantedIndex = i;
                    found = true;
                }
            }

            if (found === true) {

                const invoiceQuantityId = invoiceQuantity[wantedIndex];
                const invoiceToPass = invoices[wantedIndex];
                const documentTotalToPass = documentTotal[wantedIndex];
                const invoiceinfoToPass = invoiceInfo[wantedIndex];

                res.render("", {
                    invoiceToPass: invoiceToPass,
                    invoiceQuantityId: invoiceQuantityId,
                    documentTotalToPass: documentTotalToPass,
                    invoiceinfoToPass: invoiceinfoToPass
                });
            } else {
                res.status(404).send(null)
            }
        }
    } catch (e) {
        res.status(404).send(null)
    }
}

//Get all Invoices
const getInvoices = async (req, res) => {
    try {
        const info = await saft.find()
        if (info != null) {
            const stringified = JSON.stringify(info);
            const obj = JSON.parse(stringified);
            const invoices = obj[0].AuditFile.SourceDocuments.SalesInvoices.Invoice;
            var invoicesInArray = [];

            for (var i = 0; i < invoices.length; i++) {
                invoicesInArray[i] = obj[0].AuditFile.SourceDocuments.SalesInvoices.Invoice[i];
            }
            res.render("", {
                invoices: invoices,
                invoicesArray: invoicesArray
            });
        }
    } catch (e) {
        res.status(404).send(null)
    }
}

//Get all the Sales
const getSales = async (req, res) => {
    try {
        const info = await saft.find()
        if (info != null) {
            const stringified = JSON.stringify(info);
            const obj = JSON.parse(stringified);
            const numberOfSales = obj[0].AuditFile.SourceDocuments.SalesInvoices.NumberOfEntries;

            var salesValue = obj[0].AuditFile.GeneralLedgerEntries.Journal[1];
            var monthValueArray = [];

            var customerSales = [];
            var customerSpent = [];

            for (let i = 0; i < numberOfSales; i++) {
                customerSales[i] = obj[0].AuditFile.SourceDocuments.SalesInvoices.Invoice[i].CustomerID;
            }

            for (let i = 4; i < 10; i++) {
                customerSpent[i] = obj[0].AuditFile.MasterFiles.GeneralLedgerAccounts[i].ClosingDebitBalance;
            }
            customerSales.sort();

            var repeated = {};
            for (let i = 0, j = customerSales.length; i < j; i++) {
                repeated[customerSales[i]] = (repeated[customerSales[i]] || 0) + 1;
            }

            for (let i = 0; i < numberOfSales; i++) {
                let maxCredit = salesValue.Transaction[i].Lines[1].CreditLine.length;
                for (let j = 0; j < maxCredit; j++) {
                    monthValueArray[i] = salesValue.Transaction[i].Lines[1].CreditLine[j].CreditAmount;
                }
            }
            res.render('', { 
                repeated: repeated, 
                customerSpent: customerSpent 
            });
        }
    } catch (e) {
        res.status(404).send(null)
    }
}

//Search for a product using its ID
const getProductInfo = async (req, res) => {

    try {
        const info = await saft.find()
        if (info != null) {
            const stringified = JSON.stringify(info);
            const obj = JSON.parse(stringified);
            const products = obj[0].AuditFile.MasterFiles.Product;
            var numberOfProducts = clients.length;

            var product;

            let ix = 0; 
            let found = false;
            while (ix < numberOfProducts || found == false) {
                if (products[i].ProductCode === req.params.id) {
                    product = products[i];
                    found = true;
                }
                ix++;
            }

            res.render("", {
               product: product
            });
        }
    } catch (e) {
        res.status(404).send(null)
    }

}

//Get all Purchases made
const getPurchases = async (req, res) =>{
    try {
        const info = await saft.find()
        if (info != null) {
            const stringified = JSON.stringify(info);
            const obj = JSON.parse(stringified);
            const numberOfSales = obj[0].AuditFile.SourceDocuments.SalesInvoices.NumberOfEntries;
            const masterFiles = object[0].AuditFile.MasterFiles;
            const totalEntries = obj[0].AuditFile.GeneralLedgerEntries.NumberOfEntries;

            const numberOfPurchases = totalEntries - numberOfSales;

            var months = [];
            var monthTotal = [];

            for (let i = 0; i < numberOfSales; i++) {
                months[i] = 0;
                monthTotal[i] = 0;
            }

            var documentTotalPurchases = [];

            for (let i = 0; i < numberOfPurchases; i++) {
                documentTotalPurchases[i] = obj[0].AuditFile.GeneralLedgerEntries.Journal[0].Transaction[i];
            }

            var creditAmount = object[0].AuditFile.GeneralLedgerEntries.Journal[0];
            var month = object[0].AuditFile.GeneralLedgerEntries.Journal[0];

            for (let i = 2; i < numberOfPurchases; i++) {
                switch (month.Transaction[i].Period) {
                    case '1':
                        monthTotal[month.Transaction[i].Period - 1]
                            += parseFloat(creditAmount.Transaction[i].Line[0].CreditAmount);
                        months[month.Transaction[i].Period - 1]++;
                        break;
                    case '2':
                        monthTotal[month.Transaction[i].Period - 1]
                            += parseFloat(creditAmount.Transaction[i].Line[0].CreditAmount);
                        months[month.Transaction[i].Period - 1]++;
                        break;
                    case '3':
                        monthTotal[month.Transaction[i].Period - 1]
                            += parseFloat(creditAmount.Transaction[i].Line[0].CreditAmount);
                        months[month.Transaction[i].Period - 1]++;
                        break;
                    case '4':
                        monthTotal[month.Transaction[i].Period - 1]
                            += parseFloat(creditAmount.Transaction[i].Line[0].CreditAmount);
                        months[month.Transaction[i].Period - 1]++;
                        break;
                    case '5':
                        monthTotal[month.Transaction[i].Period - 1]
                            += parseFloat(creditAmount.Transaction[i].Line[0].CreditAmount);
                        months[month.Transaction[i].Period - 1]++;
                        break;
                    case '6':
                        monthTotal[month.Transaction[i].Period - 1]
                            += parseFloat(creditAmount.Transaction[i].Line[0].CreditAmount);
                        months[month.Transaction[i].Period - 1]++;
                        break;
                    case '7':
                        monthTotal[month.Transaction[i].Period - 1]
                            += parseFloat(creditAmount.Transaction[i].Line[0].CreditAmount);
                        months[month.Transaction[i].Period - 1]++;
                        break;
                    case '8':
                        monthTotal[month.Transaction[i].Period - 1]
                            += parseFloat(creditAmount.Transaction[i].Line[0].CreditAmount);
                        months[month.Transaction[i].Period - 1]++;
                        break;
                    case '9':
                        monthTotal[month.Transaction[i].Period - 1]
                            += parseFloat(creditAmount.Transaction[i].Line[0].CreditAmount);
                        months[month.Transaction[i].Period - 1]++;
                        break;
                    case '10':
                        monthTotal[month.Transaction[i].Period - 1]
                            += parseFloat(creditAmount.Transaction[i].Line[0].CreditAmount);
                        months[month.Transaction[i].Period - 1]++;
                        break;
                    case '11':
                        monthTotal[month.Transaction[i].Period - 1]
                            += parseFloat(creditAmount.Transaction[i].Line[0].CreditAmount);
                        months[month.Transaction[i].Period - 1]++;
                        break;
                    case '12':
                        monthTotal[month.Transaction[i].Period - 1]
                            += parseFloat(creditAmount.Transaction[i].Line[0].CreditAmount);
                        months[month.Transaction[i].Period - 1]++;
                        break;
                }
            }

            var supplierPurchasesArray = [];

            for(var i = 18; i < 26; i++){
                supplierPurchasesArray[i-18] = masterFiles.GeneralLedger[i].ClosingCreditBalance;
            }


            res.render("", {
                monthTotal: monthTotal,
                months: months,
                supplierPurchasesArray:supplierPurchasesArray
            });
        }
    } catch (e) {
        res.status(404).send(null)
    }
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
    getProductInfo,
    getPurchases
}