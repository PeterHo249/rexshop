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
            productCreate('Fujifilm XT20', 'Fujifilm XT20', 20490000, 20490000, 10, 'Fujifilm', 'camera/dslr', callback);
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
        },
        function(callback) {
            productCreate('Pentax K1 Mark II', 'Pentax K-1 Mark II', 45000000, 45900000, 10, 'Pentax', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Pentax K1', 'Pentax K1', 46000000, 46900000, 10, 'Pentax', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Pentax KP Black', 'Pentax KP Black', 27000000, 27490000, 10, 'Pentax', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Pentax K70', 'Pentax K70', 17000000, 17490000, 10, 'Pentax', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Leica X Typ 113', 'Leica X Typ 113', 45000000, 47000, 10, 'Leica', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Leica X Typ 102', 'Leica X Typ 102', 32000000, 34000000, 10, 'Leica', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Leica X2', 'Leica X2', 20000000, 22000000, 10, 'Leica', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Leica X1', 'Leica X1', 18000000, 200000000, 10, 'Leica  ', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Leica M', 'Leica M', 200000000, 210000000, 10, 'Leica', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Leica X U', 'Leica X U', 63000000, 63900000, 10, 'Leica', 'camera/dslr', callback);
        },
        function(callback) {
            productCreate('Leica M Monochrom', 'Leica M Monochrom', 155000000, 159000000, 10, 'Leica', 'camera/dslr', callback);
        },
        //Lens - Canon
        //Canon
        function(callback) {
            productCreate('Canon EF 50mm F/1.4 USM', 'Canon EF 50mm F/1.4 USM', 7000000, 7190000, 10, 'Canon', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Canon EF 85mm F1.4L IS USM', 'Canon EF 85mm F1.4L IS USM', 35000000, 35900000, 10, 'Canon', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Canon EF 35mm f/1.4L II USM ', 'Canon EF 35mm f/1.4L II USM ', 40000000, 40900000, 10, 'Canon', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Canon EF 16-35mm f/2.8L III USM ', 'Canon EF 16-35mm f/2.8L III USM ', 50000000, 51900000, 10, 'Canon', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Canon EF 50mm F/1.8 STM', 'Canon EF 50mm F/1.8 STM ', 2500000, 2880000, 10, 'Canon', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Canon EF-S 18-55mm F/3.5-5.6 IS STM', 'Canon EF-S 18-55mm F/3.5-5.6 IS STM', 2800000, 3190000, 10, 'Canon', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Canon EF 24-105mm F/4L IS USM ', 'Canon EF 24-105mm F/4L IS USM ', 11000000, 11790000, 10, 'Canon', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Canon EF 11-24mm F/4L USM', 'Canon EF 11-24mm F/4L USM', 62000000, 64900000, 10, 'Canon', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Canon EF 135mm F/2L USM ', 'Canon EF 135mm F/2L USM ', 20000000, 21600000, 10, 'Canon', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Canon EF 85mm F/1.8 USM', 'Canon EF 85mm F/1.8 USM', 7000000, 7900000, 10, 'Canon', 'camera/len', callback);
        },
        //Lens - Nikon
        function(callback) {
            productCreate('Nikon 70-300mm VR AF-P F/4.5-6.3 DX ED', 'Nikon 70-300mm VR AF-P F/4.5-6.3 DX ED', 16000000, 16590000, 10, 'Nikon', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Nikon AF-S NIKKOR 105mm F/1.4E ED', 'Nikon AF-S NIKKOR 105mm F/1.4E ED', 40000000, 42000000, 10, 'Nikon', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Nikon AF 35mm F/2D', 'Nikon AF 35mm F/2D', 6000000, 6900000, 10, 'Nikon', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Nikon AF-S 16-85mm F/3.5-5.6G ED VR', 'Nikon AF-S 16-85mm F/3.5-5.6G ED VR', 12000000, 13190000, 10, 'Nikon', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Nikon AF 50mm F/1.4D', 'Nikon AF 50mm F/1.4D', 5500000, 6190000, 10, 'Nikon', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Nikon AF-S 50mm F/1.8G', 'Nikon AF-S 50mm F/1.8G', 4500000, 5190000, 10, 'Nikon', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Nikon AF-S 35mm F/1.8G ED FX', 'Nikon AF-S 35mm F/1.8G ED FX', 11000000, 12990000, 10, 'Nikon', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Nikon AF-S 50mm F/1.8G Special Edition', 'Nikon AF-S 50mm F/1.8G Special Edition', 5000000, 5590000, 10, 'Nikon', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Nikon AF 20mm F/2.8D', 'Nikon AF 20mm F/2.8D', 11000000, 12590000, 10, 'Nikon', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Nikon AF-S 85mm F/1.4G', 'Nikon AF-S 85mm F/1.4G', 37000000, 39000000, 10, 'Nikon', 'camera/len', callback);
        },
        //Lens - Sony
        function(callback) {
            productCreate('Sony FE 70-200mm F2.8 GM OSS', 'Sony FE 70-200mm F2.8 GM OSS', 53500000, 54900000, 10, 'Sony', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Sony E 18-135mm F/3.5-5.6 OSS', 'Sony E 18-135mm F/3.5-5.6 OSS', 13000000, 14900000, 10, 'Sony', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Sony FE 28-70mm F/3.5-5.6 OSS', 'Sony FE 28-70mm F/3.5-5.6 OSS ', 5000000, 5499000, 10, 'Sony', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Sony FE 85mm F/1.8', 'Sony FE 85mm F/1.8', 11500000, 12290000, 10, 'Sony', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Sony FE 50mm F/1.8', 'Sony FE 50mm F/1.8', 5500000, 6290000, 10, 'Sony', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Sony FE 85mm F/1.4 GM', 'Sony FE 85mm F/1.4 GM', 36000000, 36340000, 10, 'Sony', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Sony FE 28mm F/2', 'Sony FE 28mm F/2', 8000000, 8990000, 10, 'Sony', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Sony E 10-18mm F/4 OSS', 'Sony E 10-18mm F/4 OSS', 15000000, 16590000, 10, 'Sony', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Sony E 35mm F/1.8 OSS', 'Sony E 35mm F/1.8 OSSS', 7000000, 7990000, 10, 'Sony', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Sony E 50mm F/1.8 OSS', 'Sony E 50mm F/1.8 OSS', 5000000, 5490000, 10, 'Sony', 'camera/len', callback);
        },
        //Lens - Fujifilm
        function(callback) {
            productCreate('Fujifilm XF 50mm F/2 R WR', 'Fujifilm XF 50mm F/2 R WR', 9000000, 9990000, 10, 'Fujifilm', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Fujifilm XF 23mm F/2 WR', 'Fujifilm XF 23mm F/2 WR', 8000000, 8990000, 10, 'Fujifilm', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Fujifilm XF 90mm F/2 R LM WR', 'Fujifilm XF 90mm F/2 R LM WR', 20000000, 20900000, 10, 'Fujifilm', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Fujifilm XF 56mm F/1.2 R', 'Fujifilm XF 56mm F/1.2 R', 20000000, 20900000, 10, 'Fujifilm', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Fujifilm XF 16mm F/1.4 R WR', 'Fujifilm XF 16mm F/1.4 R WR ', 21000000, 21990000, 10, 'Fujifilm', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Fujifilm XF 35mm F/2 R WR', 'Fujifilm XF 35mm F/2 R WR', 8000000, 8600000, 10, 'Fujifilm', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Fujifilm XF 10-24mm F/4 R OIS', 'Fujifilm XF 10-24mm F/4 R OIS', 20000000, 20900000, 10, 'Fujifilm', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Fujifilm XF 18-55mm F/2.8-4 R LM OIS', 'Fujifilm XF 18-55mm F/2.8-4 R LM OIS', 7000000, 7990000, 10, 'Fujifilm', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Fujifilm XF 27mm F2.8', 'Fujifilm XF 27mm F2.8', 7000000, 7990000, 10, 'Fujifilm', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Fujifilm XF 14mm F/2.8 R', 'Fujifilm XF 14mm F/2.8 R', 18000000, 19000000, 10, 'Fujifilm', 'camera/len', callback);
        },
        //Lens - Pentax
        function(callback) {
            productCreate('Pentax FA 43mm F/1.9', 'Pentax FA 43mm F/1.9', 15000000, 15900000, 10, 'Pentax', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Pentax FA 77mm F/1.8', 'Pentax FA 77mm F/1.8', 17000000, 17900000, 10, 'Pentax', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Pentax DFA 50mm F/2.8 Macro', 'Pentax DFA 50mm F/2.8 Macro', 9000000, 9800000, 10, 'Pentax', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Pentax FA 31mm F/1.8', 'Pentax FA 31mm F/1.8', 23000000, 23900000, 10, 'Pentax', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Pentax HD DFA 28-105mm F/3.5-5.6 DC WR', 'Pentax HD DFA 28-105mm F/3.5-5.6 DC WR', 13000000, 13500000, 10, 'Pentax', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Pentax DA 40mm F/2.8', 'Pentax DA 40mm F/2.8', 10000000, 10890000, 10, 'Pentax', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Pentax DA 70mm F/2.4', 'Pentax DA 70mm F/2.4', 10490000, 10990000, 10, 'Pentax', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Pentax DA 15mm F/4 ED AL', 'Pentax DA 15mm F/4 ED AL', 12000000, 13000000, 10, 'Pentax', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Pentax DA 35mm F/2.8 Macro', 'Pentax DA 35mm F/2.8 Macro', 10000000, 10990000, 10, 'Pentax', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Pentax DA 10-17mm F/3.5-4.5 ED IF', 'Pentax DA 10-17mm F/3.5-4.5 ED IF', 13000000, 13500000, 10, 'Pentax', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Pentax DA 12-24mm F/4 ED AL', 'Pentax DA 12-24mm F/4 ED AL', 18000000, 18900000, 10, 'Pentax', 'camera/len', callback);
        },
        //Lens - Leica 
        function(callback) {
            productCreate('Leica Noctilux-M 50mm F/0.95 ASPH', 'Leica Noctilux-M 50mm F/0.95 ASPH', 170000000, 175000000, 10, 'Leica', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Leica 35mm F/2.0 Summicron M Aspherical', 'Leica 35mm F/2.0 Summicron M Aspherical', 63000000, 63590000, 10, 'Leica', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Leica 24mm F/1.4 Summilux-M Aspherical', 'Leica 24mm F/1.4 Summilux-M Aspherical', 135000000, 138000000, 10, 'Leica', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Leica 21mm F/1.4 Summilux-M Aspherical', 'Leica 21mm F/1.4 Summilux-M Aspherical', 145000000, 150000000, 10, 'Leica', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Leica Telephoto 75mm F/2.0 APO', 'Leica Telephoto 75mm F/2.0 APO', 77000000, 79000000, 10, 'Leica', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Leica Summilux-M 35mm F/1.4 ASPH', 'Leica Summilux-M 35mm F/1.4 ASPH', 90000000, 92900000, 10, 'Leica', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Leica Summilux-M 50mm F/1.4 ASPH', 'Leica Noctilux-M 50mm F/0.95 ASPH', 77000000, 79000000, 10, 'Leica', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Leica Telephoto 90mm F/2.0 APO ', 'Leica Telephoto 90mm F/2.0 APO ', 74000000, 75000000, 10, 'Leica', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Leica APO-Summicron-M 50mm F/2 ASPH', 'Leica APO-Summicron-M 50mm F/2 ASPH', 165000000, 169000000, 10, 'Leica', 'camera/len', callback);
        },
        function(callback) {
            productCreate('Leica 18mm F/3.8 Super-Elmar-M Aspherical', 'Leica 18mm F/3.8 Super-Elmar-M Aspherical', 130000000, 135000000, 10, 'Leica', 'camera/len', callback);
        },
        //Action - Camera
        function(callback) {
            productCreate('GoPro Fusion', 'GoPro Fusion', 17000000, 17990000, 10, 'GoPro', 'camera/action', callback);
        },
        function(callback) {
            productCreate('GoPro New Hero', 'GoPro New Hero', 5000000, 5190000, 10, 'GoPro', 'camera/action', callback);
        },
        function(callback) {
            productCreate('GoPro Hero 6 Black', 'GoPro Hero 6 Black', 9000000, 9990000, 10, 'GoPro', 'camera/action', callback);
        },
        function(callback) {
            productCreate('GoPro Hero 5 Black', 'GoPro Hero 5 Black', 7000000, 7800000, 10, 'GoPro', 'camera/action', callback);
        },
        //Battery Pin Sạc Cho Sony NP-FM500H
        function(callback) {
            productCreate('Pin Sạc Cho Sony NP-FM500H', 'Pin Sạc Cho Sony NP-FM500H', 900000, 980000, 10, 'Sony', 'accessory/battery', callback);
        },
        function(callback) {
            productCreate('Bộ Pin Sạc Cho Canon LP-E6', 'Bộ Pin Sạc Cho Canon LP-E6', 1000000, 1080000, 10, 'Canon', 'accessory/battery', callback);
        },
        function(callback) {
            productCreate('Pin Sạc Cho Canon LP-E8', 'Pin Sạc Cho Canon LP-E8', 300000, 330000, 10, 'Canon', 'accessory/battery', callback);
        },
        function(callback) {
            productCreate('Bộ Pin Sạc Cho Sony NP-BJ1 Dùng Cho Sony RX0', 'Bộ Pin Sạc Cho Sony NP-BJ1 Dùng Cho Sony RX0', 600000, 690000, 10, 'Sony', 'accessory/battery', callback);
        },
        function(callback) {
            productCreate('Pin Nikon EN-EL15a', 'Pin Nikon EN-EL15a', 1200000, 1490000, 10, 'Nikon', 'accessory/battery', callback);
        },
        function(callback) {
            productCreate('Pin Canon LP-E6N', 'Pin Canon LP-E6N', 1700000, 1900000, 10, 'Canon', 'accessory/battery', callback);
        },
        function(callback) {
            productCreate('Pin Sony NP-FZ100 Lithium-Ion', 'Pin Sony NP-FZ100 Lithium-Ion', 1700000, 1900000, 10, 'Canon', 'accessory/battery', callback);
        },
        function(callback) {
            productCreate('Pin Fujifilm NP-W126S', 'Pin Fujifilm NP-W126S', 1400000, 1490000, 10, 'Fujifilm', 'accessory/battery', callback);
        },
        function(callback) {
            productCreate('Pin Pisen LP-E12 for Canon EOS-M/ EF-M', 'Pin Pisen LP-E12 for Canon EOS-M/ EF-M', 300000, 350000, 10, 'Pinsen', 'accessory/battery', callback);
        },
        function(callback) {
            productCreate('Pin Pisen NP-FW50 for Sony', 'Pin Pisen NP-FW50 for Sony', 300000, 380000, 10, 'Pinsen', 'accessory/battery', callback);
        },
        //Accessories - Tripod 
        function(callback) {
            productCreate('Chân máy Beike Q999S', 'Chân máy Beike Q999S', 1000000, 1290000, 10, 'Beike', 'accessory/tripod', callback);
        },
        function(callback) {
            productCreate('Chân máy Velbon EX-630', 'Chân máy Velbon EX-630', 1000000, 1390000, 10, 'Velbon', 'accessory/tripod', callback);
        },
        function(callback) {
            productCreate('Chân máy Benro A2292TV1', 'Chân máy Benro A2292TV1', 4000000, 4900000, 10, 'Benro', 'accessory/tripod', callback);
        },
        function(callback) {
            productCreate('Chân máy Monopod Velbon Pro Geo V65', 'Chân máy Monopod Velbon Pro Geo V65', 3000000, 3390000, 10, 'MonoPod', 'accessory/tripod', callback);
        },
        function(callback) {
            productCreate('Chân máy Benro C2292TV2', 'Chân máy Benro C2292TV2', 7000000, 7980000, 10, 'Benro', 'accessory/tripod', callback);
        },
        function(callback) {
            productCreate('Chân máy Benro IF28C', 'Chân máy Benro IF28C', 6000000, 6680000, 10, 'Benro', 'accessory/tripod', callback);
        },
        function(callback) {
            productCreate('Chân máy Benro IF18C', 'Chân máy Benro IF18C', 3000000, 3480000, 10, 'Benro', 'accessory/tripod', callback);
        },
        function(callback) {
            productCreate('Chân máy Benro Mefoto A0350Q0', 'Chân máy Benro Mefoto A0350Q0', 2000000, 2290000, 10, 'Beike', 'accessory/tripod', callback);
        },
        function(callback) {
            productCreate('Chân máy Velbon M47', 'Chân máy Velbon M47', 800000, 870000, 10, 'Velbon', 'accessory/tripod', callback);
        },
        function(callback) {
            productCreate('Chân máy Velbon M45', 'Chân máy Velbon M45', 700000, 790000, 10, 'Velbon', 'accessory/tripod', callback);
        },
        //Accessories - Memorycard
        function(callback) {
            productCreate('Thẻ nhớ Sony SDXC UHS-II Class 10 U3 128GB', 'Thẻ nhớ Sony SDXC UHS-II Class 10 U3 128GB', 6000000, 6690000, 10, 'Sony', 'accessory/card', callback);
        },
        function(callback) {
            productCreate('Thẻ nhớ Sony SDXC UHS-II Class 10 U3 64GB', 'Thẻ nhớ Sony SDXC UHS-II Class 10 U3 64GB', 3500000, 3990000, 10, 'Sony', 'accessory/card', callback);
        },
        function(callback) {
            productCreate('Thẻ nhớ Sony SDXC UHS-II Class 10 U3 32GB', 'Thẻ nhớ Sony SDXC UHS-II Class 10 U3 32GB', 1500000, 1750000, 10, 'Sony', 'accessory/card', callback);
        },
        function(callback) {
            productCreate('Thẻ nhớ SDHC Sony 32GB 94MB/s', 'Thẻ nhớ SDHC Sony 32GB 94MB/s', 900000, 1000000, 10, 'Sony', 'accessory/card', callback);
        },
        function(callback) {
            productCreate('Thẻ Nhớ SDXC Toshiba WiFi FlashAir W-04 U3 64GB', 'Thẻ Nhớ SDXC Toshiba WiFi FlashAir W-04 U3 64GB', 1400000, 1690000, 10, 'Toshiba', 'accessory/card', callback);
        },
        function(callback) {
            productCreate('Thẻ nhớ SDHC SanDisk Extreme U3 600X 32GB 90MB', 'Thẻ nhớ SDHC SanDisk Extreme U3 600X 32GB 90MB', 6000000, 6690000, 10, 'Sandisk', 'accessory/card', callback);
        },
        function(callback) {
            productCreate('Thẻ Nhớ MicroSDHC SanDisk Ultra 32GB 80Mb/s', 'Thẻ Nhớ MicroSDHC SanDisk Ultra 32GB 80Mb/s', 300000, 390000, 10, 'Sandisk', 'accessory/card', callback);
        },
        function(callback) {
            productCreate('Thẻ nhớ Lexar Professional 2000x 32GB', 'Thẻ nhớ Lexar Professional 2000x 32GB', 1300000, 1500000, 10, 'Lexar', 'accessory/card', callback);
        },
        function(callback) {
            productCreate('Thẻ nhớ Transcend CF - 32gb / 133X', 'Thẻ nhớ Transcend CF - 32gb / 133X', 900000, 1060000, 10, 'Transcend', 'accessory/card', callback);
        },
        function(callback) {
            productCreate('Thẻ nhớ CF SanDisk Ultra - 32G / 333x / 50MB/s', 'Thẻ nhớ CF SanDisk Ultra - 32G / 333x / 50MB/s', 700000, 790000, 10, 'Sony', 'accessory/card', callback);
        },
        function(callback) {
            productCreate('Thẻ nhớ CF SanDisk Ultra - 16G / 333x / 50MB/s', 'Thẻ nhớ CF SanDisk Ultra - 16G / 333x / 50MB/s', 500000, 590000, 10, 'Sony', 'accessory/card', callback);
        },
        function(callback) {
            productCreate('Thẻ nhớ Toshiba 8GB Class10 FlashAir Wireless', 'Thẻ nhớ Toshiba 8GB Class10 FlashAir Wireless', 600000, 650000, 10, 'Sony', 'accessory/card', callback);
        },
        //Accessories - Backpack
        function(callback) {
            productCreate('Túi Vanguard Supreme Divider Insert 46', 'Túi Vanguard Supreme Divider Insert 46', 1500000, 1900000, 10, 'Vanguard', 'accessory/backpack', callback);
        },
        function(callback) {
            productCreate('Túi Vanguard Supreme Divider Insert 53', 'Túi Vanguard Supreme Divider Insert 53', 1900000, 2190000, 10, 'Vanguard', 'accessory/backpack', callback);
        },
        function(callback) {
            productCreate('Túi Vanguard Supreme Divider Insert 40', 'Túi Vanguard Supreme Divider Insert 40', 1400000, 1690000, 10, 'Vanguard', 'accessory/backpack', callback);
        },
        function(callback) {
            productCreate('Túi đeo Vanguard VEO Discover 22', 'Túi đeo Vanguard VEO Discover 22', 800000, 890000, 10, 'Vanguard', 'accessory/backpack', callback);
        },
        function(callback) {
            productCreate('Ba Lô Alta Sky 51D', 'Ba Lô Alta Sky 51D', 5000000, 5290000, 10, 'Alta', 'accessory/backpack', callback);
        },
        function(callback) {
            productCreate('Ba Lô Alta Sky 53', 'Ba Lô Alta Sky 53', 5200000, 5490000, 10, 'Alta', 'accessory/backpack', callback);
        },
        function(callback) {
            productCreate('Túi máy ảnh Crumpler Jackpack 9000', 'Túi máy ảnh Crumpler Jackpack 9000', 500000, 590000, 10, 'Crumpler', 'accessory/backpack', callback);
        },
        function(callback) {
            productCreate('Ba lô Lowepro ProTactic 450 AW', 'Ba lô Lowepro ProTactic 450 AW', 4500000, 4890000, 10, 'Lowerpro', 'accessory/backpack', callback);
        },
        function(callback) {
            productCreate('Ba lô Drone Lowepro Droneguard CS400', 'Ba lô Drone Lowepro Droneguard CS400', 2500000, 2800000, 10, 'Lowerpro', 'accessory/backpack', callback);
        },
        function(callback) {
            productCreate('Ba lô Máy Ảnh Benro CoolWalker 450N', 'Ba lô Máy Ảnh Benro CoolWalker 450N', 3000000, 3290000, 10, 'Sony', 'accessory/backpack', callback);
        },
        //Camera - Mirrorless
        function(callback) {
            productCreate('Canon EOS M50', 'Canon EOS M50', 18000000, 18900000, 10, 'Canon', 'camera/mirrorless', callback);
        },
        function(callback) {
            productCreate('Olympus PEN-F', 'Olympus PEN-F', 27000000, 28100000, 10, 'Olympus', 'camera/mirrorless', callback);
        },
        function(callback) {
            productCreate('Olympus OM-D E-M5 Mark II', 'Olympus OM-D E-M5 Mark II', 34000000, 34900000, 10, 'Olympus', 'camera/mirrorless', callback);
        },
        function(callback) {
            productCreate('Olympus OM-D E-M10 Mark II', 'Olympus OM-D E-M10 Mark II', 17000000, 17490000, 10, 'Olympus', 'camera/mirrorless', callback);
        },
        function(callback) {
            productCreate('Olympus OM-D E-M1 Mark II', 'Olympus OM-D E-M1 Mark II ', 44000000, 44900000, 10, 'Sony', 'camera/mirrorless', callback);
        },
        function(callback) {
            productCreate('Nikon Coolpix A900', 'Nikon Coolpix A900 ', 15000000, 15490000, 10, 'Nikon', 'camera/mirrorless', callback);
        },
        function(callback) {
            productCreate('Canon EOS M6', 'Canon EOS M6', 16000000, 16490000, 10, 'Canon', 'camera/mirrorless', callback);
        },
        function(callback) {
            productCreate('Sony A6700', 'Sony A6700', 30000000, 31500000, 10, 'Sony', 'camera/mirrorless', callback);
        },
        function(callback) {
            productCreate('Sony A5100', 'Sony A5100', 9000000, 9990000, 10, 'Sony', 'camera/mirrorless', callback);
        },
        function(callback) {
            productCreate('Olympus Pen E-PL8', 'Olympus Pen E-PL8', 14000000, 14590000, 10, 'Sony', 'camera/mirrorless', callback);
        },
        //Camera - compact
        function(callback) {
            productCreate('Máy chụp ảnh 360° Theta M15', 'Máy chụp ảnh 360° Theta M15', 2500000, 2990000, 10, 'Theta', 'camera/compact', callback);
        },
        function(callback) {
            productCreate('Sony Cyber-shot DSC-RX10 IV', 'Sony Cyber-shot DSC-RX10 IV', 38000000, 39900000, 10, 'Sony', 'camera/compact', callback);
        },
        function(callback) {
            productCreate('Sony DSC WX100', 'Sony DSC WX100', 1200000, 1490000, 10, 'Sony', 'camera/compact', callback);
        },
        function(callback) {
            productCreate('Canon IXUS 185', 'Canon IXUS 185', 2000000, 2350000, 10, 'Canon', 'camera/compact', callback);
        },
        function(callback) {
            productCreate('Sony Cyber-shot DSC-H400', 'Sony Cyber-shot DSC-H400 ', 5000000, 5490000, 10, 'Sony', 'camera/compact', callback);
        },
        function(callback) {
            productCreate('Fujifilm Instax Mini 9', 'Fujifilm Instax Mini 9', 1550000, 1990000, 10, 'Fujifilm', 'camera/compact', callback);
        },
        function(callback) {
            productCreate('Canon PowerShot SX730 HS', 'Canon PowerShot SX730 HS', 8000000, 8590000, 10, 'Canon', 'camera/compact', callback);
        },
        function(callback) {
            productCreate('Sony Cybershot DSC-HX350', 'Sony Cybershot DSC-HX350', 8000000, 8890000, 10, 'Sony', 'camera/compact', callback);
        },
        function(callback) {
            productCreate('Ricoh GR II Silver Edition', 'Ricoh GR II Silver Edition', 18000000, 18590000, 10, 'Pentax', 'camera/compact', callback);
        },
        function(callback) {
            productCreate('Nikon COOLPIX P900', 'Nikon COOLPIX P900', 11500000, 12190000, 10, 'Sony', 'camera/compact', callback);
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