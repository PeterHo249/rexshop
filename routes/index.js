/* jshint esversion: 6 */
let User = require('../models/user');
let auth = require('../config/auth');

module.exports = function (app, passport) {
  /* GET home page. */
  app.get('/', function (req, res, next) {
    res.redirect('/product');
  });

  app.get('/item/:id', function (req, res, next) {
    res.redirect('/product/item/' + req.params.id);
  });

  app.get('/login', function (req, res, next) {
    res.render('login', {
      login_page: true,
      error_message: req.flash('loginMessage')
    });
  });

  app.get('/signup', function (req, res, next) {
    res.render('signup', {
      login_page: true,
      error_message: req.flash('signupMessage')
    });
  });

  app.post('/login', passport.authenticate('local-login', {
    failureRedirect: '/login',
    failureFlash: true
  }), function (req, res, next) {
    if (!req.user.verified) {
      res.redirect('/verify');
    } else {
      switch (req.user.role) {
        case 'customer':
          res.redirect('/');
          break;
        case 'salesman':
          res.redirect('/salesman');
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

  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  app.get('/verify', function (req, res) {
    let mailOptions = {
      to: req.user.email,
      subject: 'Verification Email',
      user: {
        code: req.user.code
      },
      email: true
    };
    app.mailer.send('email', mailOptions, function (err, message) {
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

  app.post('/verify', function (req, res) {
    if (req.user.code === req.body.code) {
      User.findByIdAndUpdate(req.user._id, {
        $set: {
          verified: true
        }
      }, {
        new: false
      }, function (err, user) {
        if (err) {
          return handleError(err);
        }
        console.log('verified successful!');
      });
      res.redirect('/');
    } else {
      res.redirect('/verify');
    }
  });

  app.get('/cart/:id', function(req, res) {

  });

  
};