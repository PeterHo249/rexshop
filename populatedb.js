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

    user.save(function(err) {
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

    product.save(function(err) {
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

    account.save(function(err) {
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

    order.save(function(err) {
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

    order_detail.save(function(err) {
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
        function(callback) {
            productCreate('canon', 'camera mau den', 100, 150, 3, 'Canon', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('nikon', "camera chat luong cao", 100, 200, 5, 'Nikon', 'camera/compact', callback);
        },
        function(callback) {
            productCreate('Canon 5D Mark III', 'Canon 5D Mark III', 466900000, 46690000, 10, 'Canon', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Canon 5D Mark IV', 'Canon 5D Mark IV', 69990000, 69990000, 10, 'Canon', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Canon 5DS', 'Canon 5DS', 56990000, 56990000, 10, 'Canon', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Canon 6D Mark II', 'Canon 6D Mark II', 39990000, 39990000, 10, 'Canon', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Canon 70D', 'Canon 70D', 16490000, 16490000, 10, 'Canon', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Canon 77D', 'Canon 77D', 19990000, 19990000, 10, 'Canon', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Canon 200D', 'Canon 200D', 13990000, 13990000, 10, 'Canon', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Canon 800D', 'Canon 800D', 16290000, 16290000, 10, 'Canon', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Canon 1500D', 'Canon 1500D', 10300000, 10300000, 10, 'Canon', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Canon 3000D', 'Canon 3000D', 8590000, 8590000, 10, 'Canon', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Nikon D5', 'Nikon D5', 121990000, 121990000, 10, 'Nikon', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Nikon D850', 'Nikon 850', 76690000, 76690000, 10, 'Nikon', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Nikon D810', 'Nikon D810', 49990000, 49990000, 10, 'Nikon', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Nikon D500', 'Nikon D500', 37690000, 37690000, 10, 'Nikon', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Nikon D750', 'Nikon D750', 34799000, 34799000, 10, 'Nikon', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Nikon D610', 'Nikon 610', 26490000, 26490000, 10, 'Nikon', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Nikon D7200', 'Nikon D7200', 18890000, 18890000, 10, 'Nikon', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Nikon D7500', 'Nikon D7500', 26490000, 26490000, 10, 'Nikon', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Nikon D5300', 'Nikon D5300', 10790000, 10790000, 10, 'Nikon', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Nikon D5600', 'Nikon D5600', 13590000, 13590000, 10, 'Nikon', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Fujifilm GFX 50S', 'Fujifilm GFX 50S', 150000000, 150000000, 10, 'Fujifilm', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Fujifilm X-H1', 'Fujifilm X-H1', 54990000, 54990000, 10, 'Fujifilm', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Fujifilm X-T2', 'Fujifilm X-T2', 41990000, 41990000, 10, 'Fujifilm', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Fujifilm X-Pro 2', 'Fujifilm X-Pro 2', 40990000, 40990000, 10, 'Fujifilm', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Fujifilm X-E3', 'Fujifilm X-E3', 28490000, 28490000, 10, 'Fujifilm', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Fujifilm X100F', 'Fujifilm X100F', 27990000, 27990000, 10, 'Fujifilm', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Fujifilm X-E2S', 'Fujifilm X-E2S', 14990000, 14990000, 10, 'Fujifilm', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Fujifilm X-E3', 'Fujifilm X-E3', 20490000, 20490000, 10, 'Fujifilm', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Fujifilm X-A5 ', 'Fujifilm X-A5 ', 14380000, 14380000, 10, 'Fujifilm', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Fujifilm X-A10', 'Fujifilm X-A10', 7999000, 7999000, 10, 'Fujifilm', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Sony Alpha A7R III', 'Sony Alpha A7R III', 72990000, 72990000, 10, 'Sony', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Sony A99 Mark II', 'Sony A99 Mark II', 63490000, 63490000, 10, 'Sony', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Sony Alpha A7S II', 'Sony Alpha A7S II', 58000000, 58000000, 10, 'Sony', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Sony Alpha 7R II', 'Sony Alpha 7R II', 55490000, 55490000, 10, 'Sony', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Sony Alpha A6500', 'Sony Alpha A6500', 27490000, 27490000, 10, 'Sony', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Sony Alpha A6300', 'Sony Alpha A6300', 18490000, 18490000, 10, 'Sony', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Sony Alpha A6000', 'Sony Alpha A6000', 11990000, 11690000, 10, 'Sony', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Sony Alpha A9', 'Sony Alpha A9', 105990000, 105990000, 10, 'Sony', 'camera/dslr', callback);
        }
    ], cb);
}

function createUsers(cb) {
    async.parallel([
        function(callback) {
            userCreate('Dung Ho', 'Binh An', '000', 'salesman', callback);
        },
        function(callback) {
            userCreate('De Nguyen', 'Di An', '111', 'manager', callback);
        },
        function(callback) {
            userCreate('Tri Nguyen', 'HCM', '222', 'customer', callback);
        }
    ], cb);
}

function createAccounts(cb) {
    async.parallel([
        function(callback) {
            accountCreate('peterho', 'test', users[0], callback);
        },
        function(callback) {
            accountCreate('longtran', 'sab', users[1], callback);
        },
        function(callback) {
            accountCreate('trihoang', 'test', users[2], callback);
        }
    ], cb);
}

function createOrders(cb) {
    async.parallel([
        function(callback) {
            orderCreate(users[0], users[2], 'out', '150', null, 'Waiting', callback);
        }
    ], cb);
}

function createOrderDetails(cb) {
    async.parallel([
        function(callback) {
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
    function(err, results) {
        if (err) {
            console.log('FINAL ERR: ' + err);
        } else {
            console.log('Successful');
        }
        // All done, disconnect from database
        mongoose.connection.close();
    });