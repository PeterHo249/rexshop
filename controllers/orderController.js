/* jshint esversion: 6 */

let Order = require('../models/order');
let Product = require('../models/product');
let jsontoken = require('../config/jsontoken');
let async = require('async');
let moment = require('moment');


exports.list_order = function(req, res) {
    Order.find({}).exec(function(err, orders) {
        if (err) {
            console.log("Error:", err);
        } else {
            res.render('order', { order_items: orders, title: 'RexShop', salesman: true });
        }
    });
}

exports.add_order = function(req, res) {
    res.render('add_order', { title: 'RexShop', salesman: true });
};

exports.show_order = function(req, res) {
    Order.findById(req.params.id).exec(function(err, order) {
        if (err) {
            console.log("Error:", err);
        } else {
            res.render('show_order_detail', { order_item: order, title: 'RexShop', salesman: true });
        }
    });
}

exports.edit_order = function(req, res) {
    Order.findOne({ _id: req.params.id }).exec(function(err, order) {
        if (err) {
            return next(err);
        } else {
            res.render('edit_order', { order_item: order, title: 'RexShop', salesman: true })
        }
    });
}

exports.delete_order = function(req, res) {
    Order.findByIdAndRemove({ _id: req.params.id }).exec(function(err, order) {
        if (err) {
            return next(err);
        } else {
            console.log("Deleted");
            res.redirect("/salesman/order");
        }
    });
}

exports.update_order = function(req, res) {
    Order.findByIdAndUpdate({ _id: req.params.id }, {
        $set: {
            customer_id: req.body.customer_id,
            cost: req.body.cost,
            date: req.body.date,
            status: req.body.select_picker,
            count: req.body.count,
            item_list: req.body.item_list

        }
    }, { new: true }, function(err, order) {
        if (err) {
            console.log(err);
        }

        res.redirect("/salesman/order/" + order._id);
    });
}

exports.save_order = function(req, res) {
    var customer_id = req.body.customer_id;
    var date = req.body.date;
    var status = req.body.select_picker;
    var item = req.body.item;
    var count = req.body.count;
    var count2 = Number(count);
    Product.findById({ _id: item }).exec(function(err, product) {
        if (err) {
            console.log(err);
        }

        var order = new Order({
            customer_id: customer_id,
            date: date,
            status: status,
            cost: '',
            count: count2,
            item_list: []
        });
        order.cost = product.market_price * count2;
        order.item_list.push({ item: item, amount: count2 });
        order.save(function(err) {
            if (err) {
                console.log(err);
                res.render('add_order', { title: 'RexShop', salesman: true });
            } else {
                console.log("Successfully created an order.");
                res.redirect('/salesman/order/' + order._id);
            }
        });

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