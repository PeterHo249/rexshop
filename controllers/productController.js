/* jshint esversion: 6 */
let Product = require('../models/product');
let Order = require('../models/order');
let OrderDetail = require('../models/order_detail');

let async = require('async');
let jsontoken = require('../config/jsontoken');

// MARK - Need some test in this
exports.product_home = function (req, res) {
    async.parallel({
        new_items: function (callback) {
            Product.findRandom({}, {}, {
                limit: 6
            }, callback);
        },
        trend_items: function (callback) {
            Product.findRandom({}, {}, {
                limit: 6
            }, callback);
        }
    }, function (err, results) {
        if (err) {
            return next(err);
        }
        if (results.new_items == null) {
            let err = new Error('Product not found');
            err.status = 404;
            return next(err);
        }
        if (results.trend_items == null) {
            let err = new Error('Product not found');
            err.status = 404;
            return next(err);
        }
        // render
        if (req.user) {
            let cart_info = {
                cartid: '',
                userid: '',
                count: 0,
                cost: 0
            };

            if (req.cookies.carttoken && req.cookies.carttoken !== '') {
                let temp = jsontoken.decodeToken(req.cookies.carttoken);
                if (temp.userid === req.user._id) {
                    cart_info = temp;
                }
            }

            res.render('index', {
                title: 'RexShop',
                homepage: true,
                customer: true,
                user: req.user,
                new_items: results.new_items,
                trend_items: results.trend_items,
                cart: cart_info
            });
        } else {
            res.render('index', {
                title: 'RexShop',
                homepage: true,
                new_items: results.new_items,
                trend_items: results.trend_items
            });
        }

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
        if (req.user) {
            let cart_info = {
                cartid: '',
                userid: '',
                count: 0,
                cost: 0
            };

            if (req.cookies.carttoken && req.cookies.carttoken !== '') {
                let temp = jsontoken.decodeToken(req.cookies.carttoken);
                if (temp.userid === req.user._id) {
                    cart_info = temp;
                }
            }

            res.render('product_list', {
                title: 'RexShop',
                category_title: category_title,
                current_cate: req.params.category,
                product_count: results.products.length,
                product_items: results.products,
                is_filter: isFilter,
                shop_page: true,
                customer: true,
                user: req.user,
                cart: cart_info
            });
        } else {
            res.render('product_list', {
                title: 'RexShop',
                category_title: category_title,
                current_cate: req.params.category,
                product_count: results.products.length,
                product_items: results.products,
                is_filter: isFilter,
                shop_page: true
            });
        }
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
        if (req.user) {
            let cart_info = {
                cartid: '',
                userid: '',
                count: 0,
                cost: 0
            };

            if (req.cookies.carttoken && req.cookies.carttoken !== '') {
                let temp = jsontoken.decodeToken(req.cookies.carttoken);
                if (temp.userid === req.user._id) {
                    cart_info = temp;
                }
            }

            res.render('product_list', {
                title: 'RexShop',
                category_title: category_title,
                current_cate: req.params.category,
                product_count: results.products.length,
                product_items: results.products,
                is_filter: isFilter,
                shop_page: true,
                customer: true,
                user: req.user,
                cart: cart_info
            });
        } else {
            res.render('product_list', {
                title: 'RexShop',
                category_title: category_title,
                current_cate: req.params.category,
                product_count: results.products.length,
                product_items: results.products,
                is_filter: isFilter,
                shop_page: true
            });
        }
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
        if (req.user) {
            let cart_info = {
                cartid: '',
                userid: '',
                count: 0,
                cost: 0
            };

            if (req.cookies.carttoken && req.cookies.carttoken !== '') {
                let temp = jsontoken.decodeToken(req.cookies.carttoken);
                if (temp.userid === req.user._id) {
                    cart_info = temp;
                }
            }

            res.render('single_product', {
                title: 'RexShop',
                category_name: category_name,
                item: results.product,
                product_page: true,
                customer: true,
                user: req.user,
                cart: cart_info
            });
        } else {
            res.render('single_product', {
                title: 'RexShop',
                category_name: category_name,
                item: results.product,
                product_page: true
            });
        }
    });
};

exports.add_item_cart = function(req, res) {
    let cart_info = {
        cartid: '',
        userid: '',
        count: 0,
        cost: 0
    };
    if (req.cookies.carttoken && req.cookies.carttoken !== '') {
        // Already have order

        // parse JSON token to object
        cart_info = jsontoken.decodeToken(req.cookies.carttoken);
        // check valid cart
        if (req.user._id === cart_info.userid) {
            // if valid, fetch order from db and update
            Order.findById(cart_info.cartid, function(err, cart) {
                if (err) {
                    console.log(err);
                    return;
                }

                if (!cart) {
                    console.log('Do not exist cart with id: ' + cart_info.cartid);
                    return;
                }

                cart_info.count = cart_info.count + req.body.itemquantity;
                cart_info.cost = cart_info.cost + (req.body.itemquantity * req.body.itemprice);
                cart.cost = cart_info.cost;
                cart.count = cart_info.count;
                cart.save(function(err) {
                    if (err) {
                        console.log(err);
                    }
                });

                let orderdetail = new OrderDetail({
                    order_id: cart_info.cartid,
                    product_id: req.body.itemid,
                    amount: req.body.itemquantity
                });

                orderdetail.save(function(err) {
                    if (err) {
                        console.log(err);
                    }
                });
            });
        } else {
            // create new order
            let cart = new Order({
                customer_id: req.user._id,
                cost: req.body.itemquantity * req.body.itemprice,
                date: new Date(),
                count: req.body.itemquantity
            });

            cart_info.userid = req.user._id;
            cart_info.cartid = cart._id;
            cart_info.cost = cart.cost;
            cart_info.count = cart.count;

            cart.save(function(err) {
                if (err) {
                    console.log(err);
                }
            });

            let orderdetail = new OrderDetail({
                order_id: cart_info.cartid,
                product_id: req.body.itemid,
                amount: req.body.itemquantity
            });

            orderdetail.save(function(err) {
                if (err) {
                    console.log(err);
                }
            });
        }
    } else {
        // New cookie
        // create new order
        let cart = new Order({
            customer_id: req.user._id,
            cost: req.body.itemquantity * req.body.itemprice,
            date: new Date(),
            count: req.body.itemquantity
        });

        cart_info.userid = req.user._id;
        cart_info.cartid = cart._id;
        cart_info.cost = cart.cost;
        cart_info.count = cart.count;

        cart.save(function(err) {
            if (err) {
                console.log(err);
            }
        });

        let orderdetail = new OrderDetail({
            order_id: cart_info.cartid,
            product_id: req.body.itemid,
            amount: req.body.itemquantity
        });

        orderdetail.save(function(err) {
            if (err) {
                console.log(err);
            }
        });
    }

    // encode cart_info to JSON token
    let cookiestring = jsontoken.generateToken(cart_info);
    res.cookie('carttoken', cookiestring, {
        maxAge: 1000 * 60 * 60,
        httpOnly: true
    });

    res.redirect('back');
};