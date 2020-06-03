var express = require('express');
var router = express.Router();
var saft = require('../controllers/SaftController');

router.get('/status', async (req, res)=>{
    res.status("OK");
})

router.post('/company', saft.getCompanyInfo)

router.post('/allinfo', saft.getJSON)

router.post('/dashboard', saft.getInfo) //Sales + Purchases

router.post('/customer/:id', saft.getClientInfo) 

router.post('/supplier/:id', saft.getSupplierInfo) 

router.post('/invoices', saft.getInvoices)

router.post('/sales', saft.getSales) // Customers + Their Sales
router.post('/locations', saft.getClientLocations)

router.post('/product/:id', saft.getProductInfo)
router.post('/salesproduct', saft.getProductSales)
router.post('/productlisting', saft.getProducts) //Just Products

router.post('/kpi', saft.getValues)

module.exports = router; 