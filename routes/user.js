/* jshint esversion: 6 */
var express = require('express');
var router = express.Router();
var auth = require('../config/auth');
var User = require('../models/user');
var async = require('async');
var bcrypt = require('bcrypt-nodejs');
const { check, validationResult } = require('express-validator/check');

module.exports = function (app, passport) {
  /* GET users listing. */
  app.get('/profile', auth.isLoggedIn, function (req, res, next) {
    res.render('profile', {
      user: req.user,
      cart_page: true,
      customer: true
    });
  });

  app.get('/changepassword', auth.isLoggedIn, function (req, res) {
    res.render('changepassword', {
      login_page: true,
      error_message: req.flash('changePasswordMessage')
    });
  });

  app.post('/changepassword', auth.isLoggedIn, function(req, res) {
    async.waterfall([
      function(done) {
        let errors = [];
        if (req.body.currentpass === undefined || req.body.currentpass.length == 0) {
          errors.push('Current password is required.');
        }
        if (req.body.newpass === undefined || req.body.newpass.length == 0) {
          errors.push('New password is required.');
        }
        if (req.body.newpass !== req.body.renewpass) {
          errors.push('New password and re-enter password have to be the same.');
        }
        if (errors.length !== 0) {
          let message = '';
          errors.forEach(error => {
            message = message + error + '<br>';
          });
          req.flash('changePasswordMessage', message);
          console.log('=====> Error in change password');
          return res.redirect('back');
        }

        User.findById(req.user._id, function(err, user) {
          if (!user.validPassword(req.body.currentpass)) {
            req.flash('changePasswordMessage', 'Current password is not match.');
            console.log('=====> Error in change password');
            return res.redirect('back');
          }
          user.password = user.generateHash(req.body.newpass);
          user.save(function(err) {
            done(err, user);
          });
        });
      },
      function(user, done) {
        let mailOptions = {
          to: user.email,
          subject: 'Change Password Email',
          user: user,
          email: true
        };
        app.mailer.send('emailchange', mailOptions, function (err, message) {
          if (err) {
            console.log(err);
          } else {
            console.log('Email sent');
            res.redirect('/');
          }
        });
      }
    ],
    function(err) {
      console.log('redirecting...');
      res.redirect('/');
    });
  });

  app.get('/changeprofile', auth.isLoggedIn, function(req, res) {
    res.render('changeprofile', {
      login_page: true,
      error_message: req.flash('changeProfileMessage'),
      user: req.user
    });
  });

  app.post('/changeprofile', auth.isLoggedIn, function(req, res) {
    req.checkBody('fullname', 'Fullname is required.').notEmpty();
    req.checkBody('email', 'Valid is mail is required.').isEmail();
    req.checkBody('address', 'Address is required.').notEmpty();
    req.checkBody('phoneno', 'Phone number is required.').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        let message = '';
        errors.forEach(error => {
            message = message + error.msg + '<br>';
        });
        message = message + 'Please complete requirement!';
        req.flash('changeProfileMessage', message);
        res.redirect('back');
    }

    User.findByIdAndUpdate(req.user._id, {
      $set: {
        name: req.body.fullname,
        email: req.body.email,
        address: req.body.address,
        phone_number: req.body.phoneno
      }
    }, {
      new: false
    }, function (err, user) {
      if (err) {
        return handleError(err);
      }
      req.login(user, function(err) {
        if (err) {
          console.log(err);
          return;
        } else {
          console.log('Change profile successful!');
          res.redirect('/profile');
        }
      });
    });
  });
};