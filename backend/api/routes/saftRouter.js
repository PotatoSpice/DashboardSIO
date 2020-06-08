var express = require('express');
var router = express.Router();
var saft = require('../controllers/SaftController');

router.get('/status', async (req, res)=>{
    res.status("OK");
})

// # JSON SAF-T PT
router.post('/allinfo', saft.getJSON)

// # HOME
router.post('/kpi', saft.getKpiInfo)
router.post('/dashboard', saft.getDiagramInvoices) //Sales + Purchases
router.post('/invoices', saft.getTableInvoices)
// # CLIENT
router.post('/sales', saft.getTableCustomer) // Customers + Their Sales
router.post('/customers', saft.getPieChartCustomer)
// # PRODUCT
// router.post('/productlisting', saft.getProducts) //Just Products
router.post('/salesproduct', saft.getTableProductSales)
router.post('/productgroups', saft.getPieChartProductGroupSales) //Values per group

// # MISC
router.post('/company', saft.getCompanyInfo)
router.post('/customer/:id', saft.getClientInfo)
router.post('/supplier/:id', saft.getSupplierInfo) 
router.post('/product/:id', saft.getProductInfo)

module.exports = router; 