/* jshint esversion: 6 */
let Product = require('../models/product');

let async = require('async');

exports.product_home = function (req, res) {
    res.render('index', {
        title: 'RexShop'
    });
};

exports.product_category_get = function (req, res) {
    let category_type = '';
    let category_title = '';
    
    switch (req.params.category) {
        case 'dslr':
            category_type = 'camera/dslr';
            category_title = 'DSLR Camera';
            break;
        case 'mirrorless':
            category_type = 'camera/mirrorless';
            category_title = 'Mirrorless Camera';
            break;
        case 'compact':
            category_type = 'camera/compact';
            category_title = 'Compact Camera';
            break;
        case 'action':
            category_type = 'camera/action';
            category_title = 'Action Camera';
            break;
        case 'len':
            category_type = 'camera/len';
            category_title = 'Camera Len';
            break;
        case 'tripod':
            category_type = 'tripod';
            category_title = 'Tripod';
            break;
        case 'battery':
            category_type = 'battery';
            category_title = 'Battery';
            break;
        case 'card':
            category_type = 'card';
            category_title = 'Memory Card';
            break;
        case 'backpack':
            category_type = 'backpack';
            category_title = 'Backpack';
            break;
        default:
            break;
    }

    async.parallel({
        products: function (callback) {
            Product.find({
                'type': category_type
            })
            .exec(callback);
        }
    }, function (err, results) {
        if (err) {
            return next(err);
        }
        if (results.products == null) {
            let err = new Error('Product not found');
            err.status = 404;
            return next(err);
        }

        // render
        res.render('product_list', {
            title: 'RexShop',
            category_title: category_title,
            current_cate: category_type,
            product_count: results.products.length,
            product_items: results.products
        });
    });
};

exports.product_brand_get = function (req, res) {
    res.send('not implement: product brand get');
};

exports.product_detail_get = function (req, res) {
    res.send('not implement: product detail');
};