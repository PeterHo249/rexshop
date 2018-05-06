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
    let isFilter = true;

    switch (req.params.category) {
        case 'dslr':
            category_type = 'camera/dslr';
            category_title = 'DSLR Cameras';
            break;
        case 'mirrorless':
            category_type = 'camera/mirrorless';
            category_title = 'Mirrorless Cameras';
            break;
        case 'compact':
            category_type = 'camera/compact';
            category_title = 'Compact Cameras';
            break;
        case 'action':
            category_type = 'camera/action';
            category_title = 'Action Cameras';
            break;
        case 'len':
            category_type = 'camera/len';
            category_title = 'Camera Lens';
            isFilter = false;
            break;
        case 'tripod':
            category_type = 'accessory/tripod';
            category_title = 'Tripods';
            isFilter = false;
            break;
        case 'battery':
            category_type = 'accessory/battery';
            category_title = 'Batteries';
            isFilter = false;
            break;
        case 'card':
            category_type = 'accessory/card';
            category_title = 'Memory Cards';
            isFilter = false;
            break;
        case 'backpack':
            category_type = 'accessory/backpack';
            category_title = 'Backpacks';
            isFilter = false;
            break;
        case 'accessory':
            category_title = 'Accessories';
            category_type = new RegExp('^asseccory', 'i');
            isFilter = false;
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
            current_cate: req.params.category,
            product_count: results.products.length,
            product_items: results.products,
            is_filter: isFilter
        });
    });
};

exports.product_brand_get = function (req, res) {
    let category_type = '';
    let category_title = '';
    let brand_name = '';
    let isFilter = true;

    switch (req.params.category) {
        case 'dslr':
            category_type = 'camera/dslr';
            category_title = 'DSLR Cameras';
            break;
        case 'mirrorless':
            category_type = 'camera/mirrorless';
            category_title = 'Mirrorless Cameras';
            break;
        case 'compact':
            category_type = 'camera/compact';
            category_title = 'Compact Cameras';
            break;
        case 'action':
            category_type = 'camera/action';
            category_title = 'Action Cameras';
            break;
        case 'len':
            category_type = 'camera/len';
            category_title = 'Camera Lens';
            isFilter = false;
            break;
        case 'tripod':
            category_type = 'accessory/tripod';
            category_title = 'Tripods';
            isFilter = false;
            break;
        case 'battery':
            category_type = 'accessory/battery';
            category_title = 'Batteries';
            isFilter = false;
            break;
        case 'card':
            category_type = 'accessory/card';
            category_title = 'Memory Cards';
            isFilter = false;
            break;
        case 'backpack':
            category_type = 'accessory/backpack';
            category_title = 'Backpacks';
            isFilter = false;
            break;
        case 'accessory':
            category_title = 'Accessories';
            category_type = new RegExp('^asseccory', 'i');
            isFilter = false;
            break;
        default:
            break;
    }

    switch (req.params.brand) {
        case 'canon':
            brand_name = 'Canon';
            break;
        case 'nikon':
            brand_name = 'Nikon';
            break;
        case 'fujifilm':
            brand_name = 'Fujifilm';
            break;
        case 'pentax':
            brand_name = 'Pentax';
            break;
        case 'gopro':
            brand_name = 'GoPro';
            break;
        case 'sony':
            brand_name = 'Sony';
            break;
        case 'leica':
            brand_name = 'Leica';
            break;

        default:
            break;
    }

    async.parallel({
        products: function (callback) {
            Product.find({
                    'type': category_type,
                    'brand': brand_name
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
            current_cate: req.params.category,
            product_count: results.products.length,
            product_items: results.products,
            is_filter: isFilter
        });
    });
};

exports.product_detail_get = function (req, res) {
    async.parallel({
        product: function (callback) {
            Product.findById(req.params.id)
                .exec(callback);
        }
    }, function (err, results) {
        if (err) {
            return next(err);
        }
        if (results.product == null) {
            let err = new Error('Product not found');
            err.status = 404;
            return next(err);
        }

        let category_name = '';
        switch (results.product.type) {
            case 'camera/dslr':
                category_name = 'DSLR Cameras';
                break;
            case 'camera/mirrorless':
                category_name = 'Mirrorless Cameras';
                break;
            case 'camera/compact':
                category_name = 'Compact Cameras';
                break;
            case 'camera/action':
                category_name = 'Action Cameras';
                break;
            case 'accessory/baterry':
                category_name = 'Batteries';
                break;
            case 'accessory/tripod':
                category_name = 'Tripods';
                break;
            case 'accessory/card':
                category_name = 'Memory Cards';
                break;
            case 'camera/backpack':
                category_name = 'Backpacks';
                break;

            default:
                break;
        }

        // render
        res.render('single_product', {
            title: 'RexShop',
            category_name: category_name,
            item: results.product
        });
    });
};