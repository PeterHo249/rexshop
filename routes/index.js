/* jshint esversion: 6 */
let User = require('../models/user');
let Order = require('../models/order');
let Product = require('../models/product');
let auth = require('../config/auth');
let jsontoken = require('../config/jsontoken');
let async = require('async');
let crypto = require('crypto');
let bcrypt = require('bcrypt-nodejs');
let moment = require('moment');

module.exports = function(app, passport) {
    /* GET home page. */
    app.get('/', function(req, res, next) {
        res.redirect('/product');
    });

    app.get('/item/:id', function(req, res, next) {
        res.redirect('/product/item/' + req.params.id);
    });

    app.get('/login', function(req, res, next) {
        res.render('login', {
            login_page: true,
            error_message: req.flash('loginMessage')
        });
    });

    app.get('/signup', function(req, res, next) {
        res.render('signup', {
            login_page: true,
            error_message: req.flash('signupMessage')
        });
    });

    app.post('/login', passport.authenticate('local-login', {
        failureRedirect: '/login',
        failureFlash: true
    }), function(req, res, next) {
        if (!req.user.verified) {
            res.redirect('/verify');
        } else {
            switch (req.user.role) {
                case 'customer':
                    res.redirect('/');
                    break;
                case 'salesman':
                    res.redirect('/salesman/order');
                    break;
                case 'manager':
                    res.redirect('/manager');
                    break;
            }
        }
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/verify',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/verify', auth.is_logged_in('*'), function(req, res) {
        let mail_options = {
            to: req.user.email,
            subject: 'Verification Email',
            user: {
                code: req.user.code
            },
            email: true
        };
        app.mailer.send('emailverify', mail_options, function(err, message) {
            if (err) {
                console.log(err);
            } else {
                console.log('Email sent');
            }
        });
        res.render('verify', {
            login_page: true,
            user: req.user
        });
    });

    app.post('/verify', auth.is_logged_in('*'), function(req, res) {
        if (req.user.code === req.body.code) {
            User.findByIdAndUpdate(req.user._id, {
                $set: {
                    verified: true
                }
            }, {
                new: false
            }, function(err, user) {
                if (err) {
                    console.log(err);
                    return;
                } else {
                    req.login(user, function(err) {
                        if (err) {
                            console.log(err);
                            return;
                        } else {
                            console.log('verified successful!');
                        }
                    });
                }
            });
            res.redirect('/');
        } else {
            res.redirect('/verify');
        }
    });

    app.get('/forgot', function(req, res) {
        res.render('forgot', {
            login_page: true,
            error_message: req.flash('forgotMessage')
        });
    });

    app.post('/forgot', function(req, res, next) {
        async.waterfall([
                function(done) {
                    crypto.randomBytes(20, function(err, buf) {
                        let token = buf.toString('hex');
                        done(err, token);
                    });
                },
                function(token, done) {
                    User.findOne({
                        username: req.body.username
                    }, function(err, user) {
                        if (!user) {
                            req.flash('forgotMessage', 'No account with that username exist.');
                            return res.redirect('/login');
                        }

                        user.reset_password_token = token;
                        user.reset_password_Expires = Date.now() + 3600000;

                        user.save(function(err) {
                            done(err, token, user);
                        });
                    });
                },
                function(token, user, done) {
                    let mail_options = {
                        to: user.email,
                        subject: 'Reset Password Email',
                        host: req.headers.host,
                        token: token,
                        email: true
                    };
                    app.mailer.send('emailforgot', mail_options, function(err, message) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('Email sent');
                            req.flash('forgotMessage', 'An email was sent to your email.');
                            res.redirect('back');
                        }
                    });
                }
            ],
            function(err) {
                if (err) {
                    return next(err);
                }
                res.redirect('/forgot');
            });
    });

    app.get('/reset/:token', auth.is_logged_in('*'), function(req, res) {
        User.findOne({
            reset_password_token: req.params.token,
            reset_password_Expires: {
                $gt: Date.now()
            }
        }, function(err, user) {
            if (!user) {
                req.flash('forgotMessage', 'Password reset token is invalid or has expired.');
                return res.redirect('/forgot');
            }

            res.render('reset', {
                user: req.user,
                login_page: true,
                token: req.params.token,
                error_message: req.flash('resetMessage')
            });
        });
    });

    app.post('/reset/:token', auth.is_logged_in('*'), function(req, res) {
        async.waterfall([
                function(done) {
                    let errors = [];
                    if (req.body.password === undefined || req.body.password.length == 0) {
                        errors.push('New password is required.');
                    }
                    if (req.body.password.length < 8 || req.body.password.length > 32) {
                        errors.push('Password must have 8 - 32 letters.');
                    }
                    if (req.body.password !== req.body.repassword) {
                        errors.push('New password and re-enter password have to be the same.');
                    }
                    if (errors.length !== 0) {
                        let message = '';
                        errors.forEach(error => {
                            message = message + error + '<br>';
                        });
                        req.flash('resetMessage', message);
                        return res.redirect('back');
                    }

                    User.findOne({
                        reset_password_token: req.params.token,
                        reset_password_Expires: {
                            $gt: Date.now()
                        }
                    }, function(err, user) {
                        if (!user) {
                            req.flash('resetMessage', 'Password reset token is invalid or has expired.');
                            return res.redirect('back');
                        }

                        user.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null);
                        user.reset_password_token = undefined;
                        user.reset_password_Expires = undefined;

                        user.save(function(err) {
                            req.logIn(user, function(err) {
                                done(err, user);
                            });
                        });
                    });
                },
                function(user, done) {
                    let mail_options = {
                        to: user.email,
                        subject: 'Confirmation Reset Password Email',
                        email: true
                    };
                    app.mailer.send('emailreset', mail_options, function(err, message) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('Email sent');
                        }
                    });
                }
            ],
            function(err) {
                res.redirect('/');
            });
    });

    app.get('/cart', auth.is_logged_in('customer'), function(req, res) {
        let cart_info = {
            cartid: '',
            userid: '',
            count: 0,
            cost: 0
        };
        res.render('cart', {
            cart_page: true,
            customer: true,
            user: req.user,
            item: [],
            cart: cart_info,
            is_blank: true
        });
    });

    app.get('/cart/:id', auth.is_logged_in('customer'), function(req, res) {
        let item_list = [];
        let is_shopping = false;
        let func_count = 0;
        let exec_times = 0;
        let address = '';
        async.waterfall([
            function(callback) {
                Order.findById(req.params.id.toString())
                    .exec(function(error, cart) {
                        if (error) {
                            console.log(error);
                            return;
                        }
                        if (cart.status === 'Waiting') {
                            is_shopping = true;
                        } else {
                            is_shopping = false;
                        }
                        if (cart.address === '' || cart.address === undefined) {
                            address = req.user.address;
                        } else {
                            address = cart.address;
                        }
                        func_count = cart.item_list.length;
                        cart.item_list.forEach(function(item_in_list) {
                            let item = {
                                quantity: item_in_list.amount
                            };
                            Product.findById(item_in_list.item.toString())
                                .exec(function(error, product) {
                                    if (error) {
                                        console.log(error);
                                        return;
                                    }

                                    item._id = product._id;
                                    item.name = product.name;
                                    item.market_price = product.market_price;
                                    item.total = product.market_price * item.quantity;

                                    item_list.push(item);
                                    exec_times += 1;
                                    if (func_count === exec_times) {
                                        callback();
                                    }
                                });
                        });
                    });
            }
        ], function() {
            let cart_info = jsontoken.decode_token(req.cookies.carttoken);
            res.render('cart', {
                cart_page: true,
                customer: true,
                user: req.user,
                address: address,
                item: item_list,
                cart: cart_info,
                is_shopping: is_shopping
            });
        });

    });

    app.post('/clearcart', auth.is_logged_in('customer'), function(req, res) {
        Order.findByIdAndRemove(req.body.cartid, function(err) {
            if (err) {
                console.log(err);
                return;
            }

            res.clearCookie('carttoken');
            res.redirect('/');
        });
    });

    app.post('/checkoutcart', auth.is_logged_in('customer'), function(req, res) {
        Order.findByIdAndUpdate(req.body.cartid, {
            $set: {
                status: 'Processing',
                address: req.body.deliveryaddress
            }
        }, {
            new: false
        }, function(err) {
            if (err) {
                console.log(err);
                return;
            }

            let mail_options = {
                to: req.user.email,
                subject: 'Confirm Checkout Cart Email',
                email: true
            };
            app.mailer.send('emailcheckoutcart', mail_options, function(err, message) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Email sent');
                    res.clearCookie('carttoken');
                    res.redirect('/');
                }
            });
        });
    });

    app.get('/shoppinghistory', auth.is_logged_in('customer'), function(req, res) {
        async.parallel({
            order_list: function(callback) {
                Order.find({customer_id: req.user._id})
                .exec(callback);
            }
        }, function(err, results) {
            if (err) {
                console.log(err);
                return err;
            }

            if (results.order_list === null) {
                let err = new Error('Product not found');
                err.status = 404;
                return err;
            }

            let is_blank = false;
            if (results.order_list.length === 0) {
                is_blank = true;
            } else {
                for (let i = 0; i < results.order_list.length; i++) {
                    results.order_list[i].formated_date = moment(results.order_list[i].date).format('DD-MM-YYYY');
                }
            }

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

            res.render('shophistory', {
                title: 'RexShop',
                customer: true,
                cart_page: true,
                user: req.user,
                cart: cart_info,
                order_list: results.order_list,
                is_blank: is_blank
            });
        });
    });
};