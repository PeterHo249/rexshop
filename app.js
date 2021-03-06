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
var fileUpload = require('express-fileupload');

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

app.use(fileUpload());

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

// Config passport
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
require('./routes/admin')(app, passport);
require('./routes/order')(app, passport);


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