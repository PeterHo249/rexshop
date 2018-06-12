/* jshint esversion: 6 */
let Order = require('../models/order');

let async = require('async');

exports.list_order = function(req, res) {
    async.parallel({
        orders: function(callback) {
            Order.find({}).exec(callback);
        }
    }, function(err, results) {
        if (err) {
            return next(err);
        }
        if (results.orders == null) {
            let err = new Error('Order not found');
            err.status = 404;
            return next(err);
        }
        if (req.user) {
            res.render('order', {
                title: 'RexShop',
                user: req.user,
                order_items: results.orders,
                salesman: true
            });
        } else {
            res.render('order', {
                title: 'RexShop',
                order_items: results.orders,
                salesman: true
            });
        }

    });
};

exports.show_order_detail = function(req, res) {
    async.parallel({
        order: function(callback) {
            Order.findById(req.params.id).exec(callback);
        }
    }, function(err, results) {
        if (err) {
            return next(err);
        }
        if (results.product == null) {
            let err = new Error('Order not found');
            err.status = 404;
            return next(err);
        }

        if (req.user) {
            res.render('order_detail', {
                title: 'RexShop',
                user: req.user,
                order_items: results.order,
                salesman: true
            });
        } else {
            res.render('order_detail', {
                title: 'RexShop',
                order_item: results.order,
                salesman: true
            });
        }

    });
};

exports.edit_order = function(req, res) {
    async.parallel({
        order: function(callback) {
            Order.findOne({ _id: req.params.id }).exec(callback);
        }
    }, function(err, results) {
        if (err) {
            return next(err);
        }
        if (results.product == null) {
            let err = new Error('Order not found');
            err.status = 404;
            return next(err);
        }

        //Render
        if (req.user) {
            res.render('order_edit', {
                title: 'RexShop',
                user: req.user,
                order_item: results.order,
                salesman: true
            });
        } else {
            res.render('order_edit', {
                title: 'RexShop',
                order_item: results.order,
                salesman: true
            });
        }
    });
};

exports.update_order = function(req, res) {
    async.parallel({
        order: function(callback) {
            Order.findByIdAndUpdate(req.params.id, {
                $set: {
                    staff_id: req.body.staff_id,
                    customer_id: req.body.customer_id,
                    cost: req.body.cost,
                    date: req.body.date,
                    status: req.body.status,
                    shopping: req.body.shopping,
                    count: req.body.count
                }
            }, { new: false }, function(err, result) {
                if (err) {
                    console.log(err);
                }

                res.redirect("/salesman/order/" + order._id);
            });
        }
    });
};

exports.delete_order = function(req, res) {
    async.parallel({
        function(callback) {
            Order.findByIdAndRemove({ _id: req.params.id }, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Deleted");
                    res.redirect("/salesman/order");
                }
            });
        }
    });
};


exports.create_order = function(req, res) {
    res.render('order_add', {
        salesman: true
    })
};

exports.order_save = function(req, res) {
    var order = new Order(req.body);
    order.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Created");
            res.redirect("/salesman/order/" + order._id);
        }
    });
};