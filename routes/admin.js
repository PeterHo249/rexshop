let express = require('express');
let router = express.Router();
let auth = require('../config/auth');

// Require controller module
var admin_controller = require('../controllers/adminController');

module.exports = function(app, passport) {
    /// PRODUCT ROUTE ///

    // GET homepage
    app.get('/admin', auth.is_logged_in('manager'), admin_controller.admin_index);

    // GET product catagories
    app.get('/admin/manage_account', auth.is_logged_in('manager'), admin_controller.admin_manage_account);

    // GET product category and brand
    app.get('/admin/manage_account/:id', auth.is_logged_in('manager'), admin_controller.admin_view_account);

    // GET product detail
    app.get('/admin/manage_product/add', auth.is_logged_in('manager'),admin_controller.admin_add_new_product);

    app.get('/admin/manage_account/edit/:id', auth.is_logged_in('manager'), admin_controller.admin_edit_account);

    app.post('/admin/manage_account/update/:id', auth.is_logged_in('manager'), admin_controller.admin_update_account);

    app.post('/admin/manage_account/delete/:id', auth.is_logged_in('manager'), admin_controller.admin_detele_account);

    app.get('/admin/manage_order', auth.is_logged_in('manager'), admin_controller.admin_manage_order);

    app.get('/admin/manage_product', auth.is_logged_in('manager'), admin_controller.admin_manage_product);

    app.get('/admin/manage_product/:id', auth.is_logged_in('manager'), admin_controller.admin_view_product);

    app.get('/admin/manage_product/edit/:id', auth.is_logged_in('manager'), admin_controller.admin_edit_product);

    app.post('/admin/manage_product/update/:id', auth.is_logged_in('manager'), admin_controller.admin_update_product);

    app.post('/admin/manage_product/delete/:id', auth.is_logged_in('manager'), admin_controller.admin_delete_product);

    app.post('/admin/manage_product/save', auth.is_logged_in('manager'), admin_controller.admin_save_product);
};