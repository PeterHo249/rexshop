/* jshint esversion: 6 */
let express = require('express');
let router = express.Router();
let auth = require('../config/auth');

// Require controller module
var product_controller = require('../controllers/productController');

module.exports = function (app, passport) {
    /// PRODUCT ROUTE ///

    // GET homepage
    app.get('/product', product_controller.product_home);

    // GET product catagories
    app.get('/product/page/:page/cate/:category', product_controller.product_category_get);

    // GET product category and brand
    app.get('/product/page/:page/cate/:category/brand/:brand', product_controller.product_brand_get);

    // GET product detail
    app.get('/product/item/:id', product_controller.product_detail_get);

    app.post('/product/cart/add', auth.isLoggedIn, product_controller.add_item_cart);

    app.get('/search', product_controller.search_get);
};