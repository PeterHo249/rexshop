let express = require('express');
let router = express.Router();
let auth = require('../config/auth');

// Require controller module
var order_controller = require('../controllers/orderController');

module.exports = function(app, passport) {
    /// PRODUCT ROUTE ///

    // GET homepage
    app.get('/salesman/order', order_controller.list_order);

    // GET product catagories
    app.get('/salesman/order/add', order_controller.add_order);

    // GET product category and brand
    app.get('/salesman/order/:id', order_controller.show_order);

    // GET product detail
    app.get('/salesman/order/edit/:id', order_controller.edit_order);

    app.post('/salesman/order/delete/:id', order_controller.delete_order);

    app.post('/salesman/order/update/:id', order_controller.update_order);

    app.get('/salesman/order/save', order_controller.save_order);
};