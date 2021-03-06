/* jshint esversion: 6 */
let Product = require('../models/product');
let Order = require('../models/order');

let async = require('async');
let jsontoken = require('../config/jsontoken');

const item_per_page = 24;
exports.get_home = function (req, res) {
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
                let temp = jsontoken.decode_token(req.cookies.carttoken);
                if (temp.userid.toString() === req.user._id.toString()) {
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

exports.get_product_category = function (req, res) {
    let category_type = '';
    let category_title = '';
    let is_filter = true;

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
            is_filter = false;
            break;
        case 'tripod':
            category_type = 'accessory/tripod';
            category_title = 'Tripods';
            is_filter = false;
            break;
        case 'battery':
            category_type = 'accessory/battery';
            category_title = 'Batteries';
            is_filter = false;
            break;
        case 'card':
            category_type = 'accessory/card';
            category_title = 'Memory Cards';
            is_filter = false;
            break;
        case 'backpack':
            category_type = 'accessory/backpack';
            category_title = 'Backpacks';
            is_filter = false;
            break;
        case 'accessory':
            category_title = 'Accessories';
            category_type = new RegExp('^asseccory', 'i');
            is_filter = false;
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
        let page_count = Math.floor(results.products.length / item_per_page);
        let request_page = parseInt(req.params.page);
        if (results.products.length % item_per_page !== 0) {
            page_count++;
        }
        let prev_page = request_page == 1 ? 1 : request_page - 1;
        let next_page = request_page == page_count ? page_count : request_page + 1;
        let page_array = [];
        for (let i = 0; i < page_count; i++) {
            let temp = {
                value: i + 1,
                is_current: false,
                has_brand: false
            };
            if (temp.value == request_page) {
                temp.is_current = true;
            }
            page_array.push(temp);
        }
        if (req.user) {
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


            res.render('product_list', {
                title: 'RexShop',
                category_title: category_title,
                current_cate: req.params.category,
                product_count: results.products.length,
                product_items: results.products.slice((request_page - 1) * item_per_page, request_page * item_per_page),
                next_page: next_page,
                prev_page: prev_page,
                page_list: page_array,
                is_filter: is_filter,
                shop_page: true,
                customer: true,
                user: req.user,
                cart: cart_info,
                page: true
            });
        } else {
            res.render('product_list', {
                title: 'RexShop',
                category_title: category_title,
                current_cate: req.params.category,
                product_count: results.products.length,
                product_items: results.products.slice((request_page - 1) * item_per_page, request_page * item_per_page),
                next_page: next_page,
                prev_page: prev_page,
                page_list: page_array,
                is_filter: is_filter,
                shop_page: true,
                page: true
            });
        }
    });
};

exports.get_product_brand = function (req, res) {
    let category_type = '';
    let category_title = '';
    let brand_name = '';
    let is_filter = true;

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
            is_filter = false;
            break;
        case 'tripod':
            category_type = 'accessory/tripod';
            category_title = 'Tripods';
            is_filter = false;
            break;
        case 'battery':
            category_type = 'accessory/battery';
            category_title = 'Batteries';
            is_filter = false;
            break;
        case 'card':
            category_type = 'accessory/card';
            category_title = 'Memory Cards';
            is_filter = false;
            break;
        case 'backpack':
            category_type = 'accessory/backpack';
            category_title = 'Backpacks';
            is_filter = false;
            break;
        case 'accessory':
            category_title = 'Accessories';
            category_type = new RegExp('^asseccory', 'i');
            is_filter = false;
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
        let page_count = Math.floor(results.products.length / item_per_page);
        let request_page = parseInt(req.params.page);
        if (results.products.length % item_per_page !== 0) {
            page_count++;
        }
        let prev_page = request_page == 1 ? 1 : request_page - 1;
        let next_page = request_page == page_count ? page_count : request_page + 1;
        let page_array = [];
        for (let i = 0; i < page_count; i++) {
            let temp = {
                value: i + 1,
                is_current: false,
                has_brand: true
            };
            if (temp.value == request_page) {
                temp.is_current = true;
            }
            page_array.push(temp);
        }
        if (req.user) {
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

            res.render('product_list', {
                title: 'RexShop',
                category_title: category_title,
                current_cate: req.params.category,
                current_brand: req.params.brand,
                product_count: results.products.length,
                product_items: results.products.slice((request_page - 1) * item_per_page, request_page * item_per_page),
                next_page: next_page,
                prev_page: prev_page,
                page_list: page_array,
                is_filter: is_filter,
                shop_page: true,
                customer: true,
                user: req.user,
                cart: cart_info,
                page: true
            });
        } else {
            res.render('product_list', {
                title: 'RexShop',
                category_title: category_title,
                current_cate: req.params.category,
                current_brand: req.params.brand,
                product_count: results.products.length,
                product_items: results.products.slice((request_page - 1) * item_per_page, request_page * item_per_page),
                next_page: next_page,
                prev_page: prev_page,
                page_list: page_array,
                is_filter: is_filter,
                shop_page: true,
                page: true
            });
        }
    });
};

exports.get_product_detail = function (req, res) {
    async.waterfall([
        function (done) {
            Product.findById(req.params.id, function(err, product) {
                done(err, product);
            });
                
        },
        function (product, done) {
            console.log(product);
            Product.findRandom({ type: product.type }, {}, {limit: 6}, function (err, relateds) {
                done(err, product, relateds);
            });
        }
    ], function (err, product, relateds) {
        if (err) {
            console.log(err);
            return err;
        }
        if (product == null) {
            let err = new Error('Product not found');
            err.status = 404;
            return err;
        }

        let category_name = '';
        switch (product.type) {
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
                let temp = jsontoken.decode_token(req.cookies.carttoken);
                if (temp.userid.toString() === req.user._id.toString()) {
                    cart_info = temp;
                }
            }

            res.render('single_product', {
                title: 'RexShop',
                category_name: category_name,
                item: product,
                product_page: true,
                customer: true,
                user: req.user,
                cart: cart_info,
                relateds: relateds
            });
        } else {
            res.render('single_product', {
                title: 'RexShop',
                category_name: category_name,
                item: product,
                product_page: true,
                relateds: relateds
            });
        }
    });
};

exports.add_item_cart = function (req, res) {
    let cart_info = {
        cartid: '',
        userid: '',
        count: 0,
        cost: 0
    };
    if (req.cookies.carttoken && req.cookies.carttoken !== '') {
        // Already have order
        console.log('---------> valid cart token');
        // parse JSON token to object
        cart_info = jsontoken.decode_token(req.cookies.carttoken);
        // check valid cart
        let req_id = req.user._id.toString();
        let cart_user_id = cart_info.userid.toString();
        if (req_id === cart_user_id) {
            // if valid, fetch order from db and update
            Order.findById(cart_info.cartid, function (err, cart) {
                if (err) {
                    console.log(err);
                    return;
                }

                if (!cart) {
                    console.log('Do not exist cart with id: ' + cart_info.cartid);
                    return;
                }

                cart_info.count = cart_info.count + parseInt(req.body.itemquantity);
                cart_info.cost = cart_info.cost + (req.body.itemquantity * req.body.itemprice);
                cart.cost = cart_info.cost;
                cart.count = cart_info.count;
                cart.item_list.push({
                    item: req.body.itemid,
                    amount: req.body.itemquantity
                });
                cart.save(function (err) {
                    if (err) {
                        console.log(err);
                    }
                });

                // encode cart_info to JSON token
                let cookiestring = jsontoken.generate_token(cart_info);
                res.cookie('carttoken', cookiestring, {
                    maxAge: 1000 * 60 * 60,
                    httpOnly: true
                });

                res.redirect('back');
            });
        } else {
            // create new order
            console.log('-----------> create new cart');
            let cart = new Order({
                customer_id: req.user._id,
                cost: req.body.itemquantity * req.body.itemprice,
                date: new Date(),
                count: req.body.itemquantity,
                item_list: []
            });

            cart_info.userid = req.user._id;
            cart_info.cartid = cart._id;
            cart_info.cost = cart.cost;
            cart_info.count = cart.count;
            cart.item_list.push({
                item: req.body.itemid,
                amount: req.body.itemquantity
            });
            console.log('------------------------>');
            console.log(cart_info);
            console.log('<------------------------');

            cart.save(function (err) {
                if (err) {
                    console.log(err);
                }
            });

            // encode cart_info to JSON token
            let cookiestring = jsontoken.generate_token(cart_info);
            res.cookie('carttoken', cookiestring, {
                maxAge: 1000 * 60 * 60,
                httpOnly: true
            });

            res.redirect('back');
        }
    } else {
        // New cookie
        // create new order
        console.log('----------------> new cookie');
        let cart = new Order({
            customer_id: req.user._id,
            cost: req.body.itemquantity * req.body.itemprice,
            date: new Date(),
            count: req.body.itemquantity,
            item_list: []
        });

        cart_info.userid = req.user._id;
        cart_info.cartid = cart._id;
        cart_info.cost = cart.cost;
        cart_info.count = cart.count;
        cart.item_list.push({
            item: req.body.itemid,
            amount: req.body.itemquantity
        });
        console.log('------------------------>');
        console.log(cart_info);
        console.log('<------------------------');

        cart.save(function (err) {
            if (err) {
                console.log(err);
            }
        });

        // encode cart_info to JSON token
        let cookiestring = jsontoken.generate_token(cart_info);
        res.cookie('carttoken', cookiestring, {
            maxAge: 1000 * 60 * 60,
            httpOnly: true
        });

        res.redirect('back');
    }
};

exports.search_product = function (req, res) {
    let category_type = '';
    let category_title = '';
    let is_filter = false;

    switch (req.query.searchcate) {
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
            break;
        case 'all':
            category_type = '*';
            category_title = 'All';
            break;
        case 'accessory':
            category_title = 'Accessories';
            category_type = new RegExp('^asseccory', 'i');
            break;
        default:
            break;
    }

    async.parallel({
            products: function (callback) {
                if (category_type === '*') {
                    Product.find({
                            $text: {
                                $search: req.query.searchstring,
                                $caseSensitive: false
                            }
                        }, {
                            score: {
                                $meta: 'textScore'
                            }
                        })
                        .sort({
                            score: {
                                $meta: 'textScore'
                            }
                        })
                        .exec(callback);
                } else {
                    Product.find({
                            'type': category_type,
                            $text: {
                                $search: req.query.searchstring,
                                $caseSensitive: false
                            }
                        }, {
                            score: {
                                $meta: 'textScore'
                            }
                        })
                        .sort({
                            score: {
                                $meta: 'textScore'
                            }
                        })
                        .exec(callback);
                }
            }
        },
        function (err, results) {
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
                    let temp = jsontoken.decode_token(req.cookies.carttoken);
                    if (temp.userid.toString() === req.user._id.toString()) {
                        cart_info = temp;
                    }
                }


                res.render('product_list', {
                    title: 'RexShop',
                    category_title: 'Search Result',
                    product_count: results.products.length,
                    product_items: results.products,
                    is_filter: is_filter,
                    shop_page: true,
                    customer: true,
                    user: req.user,
                    cart: cart_info
                });
            } else {
                res.render('product_list', {
                    title: 'RexShop',
                    category_title: 'Search Result',
                    product_count: results.products.length,
                    product_items: results.products,
                    is_filter: is_filter,
                    shop_page: true
                });
            }
        });
};