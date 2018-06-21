/* jshint esversion: 6 */
let express = require('express');
let router = express.Router();
let auth = require('../config/auth');

// Require controller module
var product_controller = require('../controllers/productController');

module.exports = function (app, passport) {
    /// PRODUCT ROUTE ///

    // GET homepage
    app.get('/product', product_controller.get_home);

    // GET product catagories
    app.get('/product/page/:page/cate/:category', product_controller.get_product_category);

    // GET product category and brand
    app.get('/product/page/:page/cate/:category/brand/:brand', product_controller.get_product_brand);

    // GET product detail
    app.get('/product/item/:id', product_controller.get_product_detail);

    app.post('/product/cart/add', auth.is_logged_in('customer'), product_controller.add_item_cart);

    app.get('/search', product_controller.search_product);
};