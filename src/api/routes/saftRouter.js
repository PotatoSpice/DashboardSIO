var express = require('express');
var router = express.Router();
var saft = require('../controllers/SaftController');

router.post('/parsefile', saft.parseFile)

router.get('/allinfo', saft.getJSON)

router.get('/dashboard', saft.getInfo)

router.get('/customer/:id', saft.getClientInfo)

router.get('/supplier/:id', saft.getSupplierInfo)

router.get('/invoices', saft.getInvoices)

router.get('/invoices/:id', saft.getInvoice)

router.get('/sales', saft.getSales)

router.get('/product/:id', saft.getProductInfo)


