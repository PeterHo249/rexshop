/* jshint esversion: 6 */
let express = require('express');
let router = express.Router();

// Require controller module
var product_controller = require('../controllers/productController');


/// PRODUCT ROUTE ///

// GET homepage
router.get('/', product_controller.product_home);

// GET product catagories
router.get('/cate/:category', product_controller.product_category_get);

// GET product category and brand
router.get('/cate/:category/brand/:brand', product_controller.product_brand_get); 

// GET product detail
router.get('/item/:id', product_controller.product_detail_get);

module.exports = router;