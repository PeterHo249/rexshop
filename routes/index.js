/* jshint esversion: 6 */
let User = require('../models/user');
let auth = require('../config/auth');
let async = require('async');
let crypto = require('crypto');
let bcrypt = require('bcrypt-nodejs');

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
    app.mailer.send('emailverify', mailOptions, function (err, message) {
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
        User.findOne({ username: req.body.username }, function(err, user) {
          if (!user) {
            req.flash('forgotMessage', 'No account with that username exist.');
            return res.redirect('/login');
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000;

          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        let mailOptions = {
          to: user.email,
          subject: 'Reset Password Email',
          host: req.headers.host,
          token: token,
          email: true
        };
        app.mailer.send('emailforgot', mailOptions, function (err, message) {
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

  app.get('/reset/:token', function(req, res) {
    User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}}, function(err, user) {
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

  app.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires:{$gt: Date.now()}}, function(err, user) {
          if (!user) {
            req.flash('resetMessage', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }

          user.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null);
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;

          user.save(function(err) {
            req.logIn(user, function(err) {
              done(err, user);
            });
          });
        });
      },
      function(user, done) {
        let mailOptions = {
          to: user.email,
          subject: 'Confirmation Reset Password Email',
          email: true
        };
        app.mailer.send('emailreset', mailOptions, function (err, message) {
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

  app.get('/cart/:id', function(req, res) {

  });

  
};