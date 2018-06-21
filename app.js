/*jshint esversion: 6*/
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var bodyParser = require('body-parser');
var validator = require('express-validator');
var mailer = require('express-mailer');
var app = express();

let User = require('./models/user');
let Order = require('./models/order');
let Product = require('./models/product');
//Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = 'mongodb://peterho249:from!to8@ds263989.mlab.com:63989/rexshop';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.engine('.hbs', expressHbs({ defaultLayout: 'layout', extname: '.hbs' }));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator({
    customValidators: {
        isEqual: (value1, value2) => {
            return value1 === value2;
        }
    }
}));
app.use(express.static(path.join(__dirname, 'public')));

// Passport config
var passport = require('passport');
require('./config/passport')(passport);
var expressSession = require('express-session');
app.use(expressSession({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Config flash
var flash = require('connect-flash');
app.use(flash());

// Config mailer
mailer.extend(app, {
    from: 'no-reply@rexshop.com',
    host: 'smtp.gmail.com',
    secureConnection: true,
    port: 465,
    transportMethod: 'SMTP',
    auth: {
        user: 'peterho951357@gmail.com',
        pass: 'thanchetpro123'
    }
});

require('./routes/index')(app, passport);
require('./routes/product')(app, passport);
require('./routes/user')(app, passport);


// Set up route for salesman
app.get('/salesman/order', function(req, res) {
    Order.find({}).exec(function(err, orders) {
        if (err) {
            console.log("Error:", err);
        } else {
            res.render('order', { order_items: orders, title: 'RexShop', salesman: true });
        }
    });
});

app.get('/salesman/order/add', function(req, res) {
    res.render('add_order', { title: 'RexShop', salesman: true });
});
app.get('/salesman/order/:id', function(req, res) {
    Order.findById(req.params.id).exec(function(err, order) {
        if (err) {
            console.log("Error:", err);
        } else {
            res.render('show_order_detail', { order_item: order, title: 'RexShop', salesman: true });
        }
    });
});

app.get('/salesman/order/edit/:id', function(req, res) {
    Order.findOne({ _id: req.params.id }).exec(function(err, order) {
        if (err) {
            return next(err);
        } else {
            res.render('edit_order', { order_item: order, title: 'RexShop', salesman: true })
        }
    });
});

app.post('/salesman/order/delete/:id', function(req, res) {
    Order.findByIdAndRemove({ _id: req.params.id }).exec(function(err, order) {
        if (err) {
            return next(err);
        } else {
            console.log("Deleted");
            res.redirect("/salesman/order");
        }
    });
});

app.post('/salesman/order/update/:id', function(req, res) {
    Order.findByIdAndUpdate({ _id: req.params.id }, {
        $set: {
            customer_id: req.body.customer_id,
            cost: req.body.cost,
            date: req.body.date,
            status: req.body.select_picker,
            count: req.body.count,
            item_list: req.body.item_list

        }
    }, { new: true }, function(err, order) {
        if (err) {
            console.log(err);
        }

        res.redirect("/salesman/order/" + order._id);
    });
});

app.post('/salesman/order/save', function(req, res) {
    var customer_id = req.body.customer_id;
    var date = req.body.date;
    var status = req.body.select_picker;
    var item = req.body.item;
    var count = req.body.count;
    var count2 = Number(count);
    Product.findById({ _id: item }).exec(function(err, product) {
        if (err) {
            console.log(err);
        }

        var order = new Order({
            customer_id: customer_id,
            date: date,
            status: status,
            cost: '',
            count: count2,
            item_list: []
        });
        order.cost = product.market_price * count2;
        order.item_list.push({ item: item, amount: count2 });
        order.save(function(err) {
            if (err) {
                console.log(err);
                res.render('add_order', { title: 'RexShop', salesman: true });
            } else {
                console.log("Successfully created an order.");
                res.redirect('/salesman/order/' + order._id);
            }
        });

    });
});


//Set up route for admin

app.get('/admin', function(req, res) {
    res.render('index_admin', { admin: true, title: 'RexShop' });
});

app.get('/admin/manage_account', function(req, res) {
    User.find({}).exec(function(err, users) {
        if (err) {
            console.log("Error:", err);
        } else {
            res.render('account_table', { items: users, title: 'RexShop', admin: true });
        }
    });
});

app.get('/admin/manage_account/:id', function(req, res) {
    User.findById(req.params.id).exec(function(err, user) {
        if (err) {
            console.log("Error:", err);
        } else {
            res.render('show_account_detail', { item: user, title: 'RexShop', admin: true });
        }
    });
});

app.get('/admin/manage_account/edit/:id', function(req, res) {
    User.findOne({ _id: req.params.id }).exec(function(err, user) {
        if (err) {
            return next(err);
        } else {
            res.render('edit_account', { item: user, title: 'RexShop', admin: true })
        }
    });
});

app.post('/admin/manage_account/update/:id', function(req, res) {
    var name = req.body.name;
    var address = req.body.address;
    var phone = req.body.phone;
    var role = req.body.select_picker;
    var email = req.body.email;
    User.findByIdAndUpdate({ _id: req.params.id }, {
        $set: {
            name: name,
            address: address,
            phone_number: phone,
            role: role,
            email: email
        }
    }, { new: false }, function(err, user) {
        if (err) {
            console.log(err);
        }

        res.redirect("/admin/manage_account/" + user._id);
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
x