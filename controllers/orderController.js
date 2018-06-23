/* jshint esversion: 6 */
let Order = require('../models/order');

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
}