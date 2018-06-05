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
  app.get('/user', auth.isLoggedIn, function (req, res, next) {
    res.send('user info: ' + req.user);
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
};