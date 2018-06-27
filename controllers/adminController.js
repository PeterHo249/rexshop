let Product = require('../models/product');
let Order = require('../models/order');
let User = require('../models/user');

var mkdirp = require('mkdirp');
var fs = require('fs-extra');

exports.admin_index = function(req, res) {
    res.render('index_admin', { admin: true, title: 'RexShop' });
};

exports.admin_manage_account = function(req, res) {
    User.find({}).exec(function(err, users) {
        if (err) {
            console.log("Error:", err);
        } else {
            res.render('account_table', { items: users, title: 'RexShop', admin: true });
        }
    });
}

exports.admin_view_account = function(req, res) {
    User.findById(req.params.id).exec(function(err, user) {
        if (err) {
            console.log("Error:", err);
        } else {
            res.render('show_account_detail', { item: user, title: 'RexShop', admin: true });
        }
    });
}

exports.admin_edit_account = function(req, res) {
    User.findOne({ _id: req.params.id }).exec(function(err, user) {
        if (err) {
            return next(err);
        } else {
            res.render('edit_account', { item: user, title: 'RexShop', admin: true })
        }
    });
}

exports.admin_update_account = function(req, res) {
    var name = req.body.name;
    var address = req.body.address;
    var phone = req.body.phone;
    var role = req.body.select_picker;
    var email = req.body.email;
    User.findByIdAndUpdate({ _id: req.params.id }, {
        $set: {
            name: name,
            address: address,
            phone_number: phone,
            role: role,
            email: email,
        }
    }, { new: false }, function(err, user) {
        if (err) {
            console.log(err);
        }

        res.redirect("/admin/manage_account/" + user._id);
    });
}

exports.admin_detele_account = function(req, res) {
    User.findById({ _id: req.params.id }).exec(function(err, user) {
        if (err) {
            console.log("Error:", err);
        } else {
            if (user.role == 'manager') {
                console.log("Admin account can't delete!");
                res.redirect("/admin/manage_account/");
            } else {
                User.findByIdAndRemove({ _id: req.params.id }).exec(function(err, user) {
                    if (err) {
                        return next(err);
                    } else {
                        console.log("Deleted");
                        res.redirect("/admin/manage_account");
                    }
                });
            }
        }
    });


}

exports.admin_manage_order = function(req, res) {
    res.redirect('/salesman/order');
};


exports.admin_manage_product = function(req, res) {
    Product.find({}).exec(function(err, products) {
        if (err) {
            console.log("Error:", err);
        } else {
            res.render('product_table', { items: products, title: 'RexShop', admin: true });
        }
    });
}


exports.admin_view_product = function(req, res) {
    Product.findById(req.params.id).exec(function(err, product) {
        if (err) {
            console.log("Error:", err);
        } else {
            res.render('show_product_detail', { item: product, title: 'RexShop', admin: true });
        }
    });
}


exports.admin_edit_product = function(req, res) {
    Product.findOne({ _id: req.params.id }).exec(function(err, product) {
        if (err) {
            return next(err);
        } else {
            res.render('edit_product', { item: product, title: 'RexShop', admin: true })
        }
    });
}

exports.admin_update_product = function(req, res) {
    var name = req.body.name;
    var description = req.body.description;
    var inventory_count = req.body.inventory_count;
    var receipt_price = req.body.receipt_price;
    var market_price = req.body.market_price;
    var brand = req.body.brand;
    var type = req.body.type;

    Product.findByIdAndUpdate({ _id: req.params.id }, {
        $set: {
            name: name,
            description: description,
            inventory_count: inventory_count,
            receipt_price: receipt_price,
            market_price: market_price,
            brand: brand,
            type: type
        }
    }, { new: false }, function(err, product) {
        if (err) {
            console.log(err);
        }

        res.redirect("/admin/manage_product/" + product._id);
    });
}

exports.admin_delete_product = function(req, res) {
    Product.findByIdAndRemove({ _id: req.params.id }).exec(function(err, product) {
        if (err) {
            return next(err);
        } else {
            console.log("Deleted");
            res.redirect("/admin/manage_product");
        }
    });
}

exports.admin_add_new_product = function(req, res) {
    res.render('add_product', { title: 'RexShop', admin: true });
};

exports.admin_save_product = function(req, res) {

    var name = req.body.name;
    var description = req.body.description;
    var inventory_count = req.body.inventory_count;
    var receipt_price = req.body.receipt_price;
    var market_price = req.body.market_price;
    var brand = req.body.brand;
    var type = req.body.type;

    var product = new Product({
        name: name,
        description: description,
        inventory_count: inventory_count,
        receipt_price: receipt_price,
        market_price: market_price,
        brand: brand,
        type: type
    });

    product.save(function(err) {
        if (err) {
            console.log(err);
            res.render('add_product', { title: 'RexShop', admin: true });
        } else {
            console.log("Successfully created a product!!");
            res.redirect('/admin/manage_product/' + product._id);
        }
    });
}