
let auth = require('../config/auth');

// Require controller module
var order_controller = require('../controllers/orderController');

module.exports = function(app, passport) {
    /// PRODUCT ROUTE ///
    // GET homepage
    app.get('/salesman/order', auth.is_logged_in('*'), order_controller.list_order);

    // GET product catagories
    app.get('/salesman/order/add', auth.is_logged_in('*'), order_controller.add_order);

    // GET product category and brand
    app.get('/salesman/order/:id', auth.is_logged_in('*'), order_controller.show_order);

    // GET product detail
    app.get('/salesman/order/edit/:id', auth.is_logged_in('*'), order_controller.edit_order);

    app.post('/salesman/order/delete/:id', auth.is_logged_in('*'), order_controller.delete_order);

    app.post('/salesman/order/update/:id', auth.is_logged_in('*'), order_controller.update_order);

    app.post('/salesman/order/save', auth.is_logged_in('*'), order_controller.save_order);
};