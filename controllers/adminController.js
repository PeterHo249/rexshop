let Product = require('../models/product');
let Order = require('../models/order');
let User = require('../models/user');

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
    var username = req.body.username;
    var password = req.body.password;
    var verified = req.body.verified;
    User.findByIdAndUpdate({ _id: req.params.id }, {
        $set: {
            name: name,
            address: address,
            phone_number: phone,
            role: role,
            email: email,
            username: username,
            password: password,
            verified: verified
        }
    }, { new: false }, function(err, user) {
        if (err) {
            console.log(err);
        }

        res.redirect("/admin/manage_account/" + user._id);
    });
}

exports.admin_detele_account = function(req, res) {
    User.findByIdAndRemove({ _id: req.params.id }).exec(function(err, user) {
        if (err) {
            return next(err);
        } else {
            console.log("Deleted");
            res.redirect("/admin/manage_account");
        }
    });
}

exports.admin_manage_order = function(req, res) {
    res.redirect('/salesman/order');
};