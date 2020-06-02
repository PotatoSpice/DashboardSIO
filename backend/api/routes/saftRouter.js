var express = require('express');
var router = express.Router();
var saft = require('../controllers/SaftController');

router.get('/status', async (req, res)=>{
    res.status("OK");
})

router.get('/company', saft.getCompanyInfo)

router.get('/allinfo', saft.getJSON)

router.get('/dashboard', saft.getInfo) //Sales + Purchases

router.get('/customer/:id', saft.getClientInfo)

router.get('/supplier/:id', saft.getSupplierInfo)

router.get('/invoices', saft.getInvoices)

router.get('/sales', saft.getSales)

router.get('/product/:id', saft.getProductInfo)
router.get('/kpi', saft.getValues)

module.exports = router; 