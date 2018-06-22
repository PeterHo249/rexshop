/* jshint esversion: 6 */

let Order = require('../models/order');
let Product = require('../models/product');
let jsontoken = require('../config/jsontoken');
let async = require('async');
let moment = require('moment');

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
        // if (req.user) {
        //     res.render('order', {
        //         title: 'RexShop',
        //         user: req.user,
        //         order_items: results.orders,
        //         salesman: true
        //     });
        // } else {
        //     res.render('order', {
        //         title: 'RexShop',
        //         order_items: results.orders,
        //         salesman: true
        //     });
        // }
        res.render('order', {
            title: 'RexShop',
            order_items: results.orders,
            homepage: true,
            salesman: true
        });
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


// Refactored
exports.get_empty_cart = function(req, res) {
    let cart_info = {
        cartid: '',
        userid: '',
        count: 0,
        cost: 0
    };
    res.render('cart', {
        cart_page: true,
        customer: true,
        user: req.user,
        item: [],
        cart: cart_info,
        is_blank: true
    });
};

exports.get_cart = function(req, res) {
    let item_list = [];
        let is_shopping = false;
        let func_count = 0;
        let exec_times = 0;
        let total = 0;
        let address = '';
        async.waterfall([
            function(callback) {
                Order.findById(req.params.id.toString())
                    .exec(function(error, cart) {
                        if (error) {
                            console.log(error);
                            return;
                        }
                        if (cart.status === 'Waiting') {
                            is_shopping = true;
                        } else {
                            is_shopping = false;
                        }
                        if (cart.address === '' || cart.address === undefined) {
                            address = req.user.address;
                        } else {
                            address = cart.address;
                        }
                        total = cart.cost;
                        cartid = cart._id;
                        func_count = cart.item_list.length;
                        cart.item_list.forEach(function(item_in_list) {
                            let item = {
                                quantity: item_in_list.amount
                            };
                            Product.findById(item_in_list.item.toString())
                                .exec(function(error, product) {
                                    if (error) {
                                        console.log(error);
                                        return;
                                    }

                                    item._id = product._id;
                                    item.name = product.name;
                                    item.market_price = product.market_price;
                                    item.total = product.market_price * item.quantity;

                                    item_list.push(item);
                                    exec_times += 1;
                                    if (func_count === exec_times) {
                                        callback();
                                    }
                                });
                        });
                    });
            }
        ], function() {
            let cart_info = {
                cartid: '',
                userid: '',
                count: 0,
                cost: 0
            };
            if (req.cookies.carttoken && req.cookies.carttoken !== '') {
                let temp = jsontoken.decode_token(req.cookies.carttoken);
                if (temp.userid.toString() === req.user._id.toString()) {
                    cart_info = temp;
                }
            }
            res.render('cart', {
                cart_page: true,
                customer: true,
                user: req.user,
                address: address,
                item: item_list,
                cart: cart_info,
                is_shopping: is_shopping,
                total_cart: total,
                cartid: cartid
            });
        });
};

exports.clear_cart = function(req, res) {
    Order.findByIdAndRemove(req.body.cartid, function(err) {
        if (err) {
            console.log(err);
            return;
        }

        res.clearCookie('carttoken');
        res.redirect('/');
    });
};

exports.get_shopping_history = function(req, res) {
    async.parallel({
        order_list: function(callback) {
            Order.find({customer_id: req.user._id})
            .exec(callback);
        }
    }, function(err, results) {
        if (err) {
            console.log(err);
            return err;
        }

        if (results.order_list === null) {
            let err = new Error('Product not found');
            err.status = 404;
            return err;
        }

        let is_blank = false;
        if (results.order_list.length === 0) {
            is_blank = true;
        } else {
            for (let i = 0; i < results.order_list.length; i++) {
                results.order_list[i].formated_date = moment(results.order_list[i].date).format('DD-MM-YYYY');
            }
        }

        let cart_info = {
            cartid: '',
            userid: '',
            count: 0,
            cost: 0
        };

        if (req.cookies.carttoken && req.cookies.carttoken !== '') {
            let temp = jsontoken.decode_token(req.cookies.carttoken);
            if (temp.userid.toString() === req.user._id.toString()) {
                cart_info = temp;
            }
        }

        res.render('shophistory', {
            title: 'RexShop',
            customer: true,
            cart_page: true,
            user: req.user,
            cart: cart_info,
            order_list: results.order_list,
            is_blank: is_blank
        });
    });
};