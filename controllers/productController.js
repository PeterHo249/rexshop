/* jshint esversion: 6 */
let Product = require('../models/product');
let Order = require('../models/order');

let async = require('async');
let jsontoken = require('../config/jsontoken');

const item_per_page = 24;
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
                let temp = jsontoken.decodeToken(req.cookies.carttoken);
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
                is_filter: isFilter,
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
                is_filter: isFilter,
                shop_page: true,
                page: true
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
                let temp = jsontoken.decodeToken(req.cookies.carttoken);
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
                is_filter: isFilter,
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
                is_filter: isFilter,
                shop_page: true,
                page: true
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
                if (temp.userid.toString() === req.user._id.toString()) {
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
        cart_info = jsontoken.decodeToken(req.cookies.carttoken);
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
                console.log('------------------------>');
                console.log(cart_info);
                console.log('<------------------------');
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
                let cookiestring = jsontoken.generateToken(cart_info);
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
            let cookiestring = jsontoken.generateToken(cart_info);
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
        let cookiestring = jsontoken.generateToken(cart_info);
        res.cookie('carttoken', cookiestring, {
            maxAge: 1000 * 60 * 60,
            httpOnly: true
        });

        res.redirect('back');
    }
};

exports.search_get = function (req, res) {
    let category_type = '';
    let category_title = '';
    let isFilter = false;

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
                    let temp = jsontoken.decodeToken(req.cookies.carttoken);
                    if (temp.userid.toString() === req.user._id.toString()) {
                        cart_info = temp;
                    }
                }


                res.render('product_list', {
                    title: 'RexShop',
                    category_title: 'Search Result',
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
                    category_title: 'Search Result',
                    product_count: results.products.length,
                    product_items: results.products,
                    is_filter: isFilter,
                    shop_page: true
                });
            }
        })
}