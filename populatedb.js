#! /usr/bin/env node

console.log('This script populates some test account, user, product, order and orderdetail to your database. Specified database as argument - e.g.: populatedb mongodb://your_username:your_password@your_dabase_url');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return;
}

var async = require('async');
var Account = require('./models/account');
var User = require('./models/user');
var Product = require('./models/product');
var Order = require('./models/order');
var OrderDetail = require('./models/order_detail');


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var accounts = [];
var users = [];
var products = [];
var orders = [];
var order_details = [];

function userCreate(name, address, phone_number, role, cb) {
    var user = new User({
        name: name,
        address: address,
        phone_number: phone_number,
        role: role
    });

    user.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }

        console.log('New user: ' + user);
        users.push(user);
        cb(null, user);
    });
}

function productCreate(name, desciption, receipt_price, market_price, inventory_count, brand, type, cb) {
    var product = new Product({
        name: name,
        desciption: desciption,
        receipt_price: receipt_price,
        market_price: market_price,
        inventory_count: inventory_count,
        brand: brand,
        type: type
    });

    product.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }

        console.log('New product: ' + product);
        products.push(product);
        cb(null, product);
    });
}

function accountCreate(username, password, user_id, cb) {
    var account = new Account({
        username: username,
        password: password,
        user_id: user_id
    });

    account.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }

        console.log('New account: ' + account);
        accounts.push(account);
        cb(null, account);
    });
}

function orderCreate(staff_id, customer_id, order_type, cost, date, status, cb) {
    var order = new Order({
        staff_id: staff_id,
        customer_id: customer_id,
        order_type: order_type,
        cost: cost,
        date: date,
        status: status
    });

    order.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }

        console.log('New order: ' + order);
        orders.push(order);
        cb(null, order);
    });
}

function orderDetailCreate(order_id, product_id, amount, cb) {
    var order_detail = new OrderDetail({
        order_id: order_id,
        product_id: product_id,
        amount: amount
    });

    order_detail.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }

        console.log('New order detail: ' + order_detail);
        order_details.push(order_detail);
        cb(null, order_detail);
    });
}

function createProducts(cb) {
    async.parallel([
        function (callback) {
            productCreate('canon', 'camera mau den', 100, 150, 3, callback);
        },
        function (callback) {
            productCreate('nikon', "camera chat luong cao", 100, 200, 5, callback);
        }
    ], cb);
}

function createUsers(cb) {
    async.parallel([
        function (callback) {
            userCreate('Dung Ho', 'Binh An', '000', 'salesman', callback);
        },
        function (callback) {
            userCreate('De Nguyen', 'Di An', '111', 'manager', callback);
        },
        function (callback) {
            userCreate('Tri Nguyen', 'HCM', '222', 'customer', callback);
        }
    ], cb);
}

function createAccounts(cb) {
    async.parallel([
        function (callback) {
            accountCreate('peterho', 'test', users[0], callback);
        },
        function (callback) {
            accountCreate('longtran', 'sab', users[1], callback);
        },
        function (callback) {
            accountCreate('trihoang', 'test', users[2], callback);
        }
    ], cb);
}

function createOrders(cb) {
    async.parallel([
        function (callback) {
            orderCreate(users[0], users[2], 'out', '150', callback);
        }
    ], cb);
}

function createOrderDetails(cb) {
    async.parallel([
        function (callback) {
            orderDetailCreate(orders[0], products[0], 1, callback);
        }
    ], cb);
}

async.series([
        createProducts,
        createUsers,
        createAccounts,
        createOrders,
        createOrderDetails
    ],
    // Optional callback
    function (err, results) {
        if (err) {
            console.log('FINAL ERR: ' + err);
        } else {
            console.log('Successful');
        }
        // All done, disconnect from database
        mongoose.connection.close();
    });