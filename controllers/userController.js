/* jshint esversion: 6 */
var User = require('../models/user');
var async = require('async');
let jsontoken = require('../config/jsontoken');
const {
  check,
  validationResult
} = require('express-validator/check');


exports.get_profile = function(req, res) {
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
  
      res.render('profile', {
        user: req.user,
        cart_page: true,
        customer: true,
        cart: cart_info
      });
};

exports.get_change_password = function (req, res) {
    res.render('changepassword', {
        login_page: true,
        error_message: req.flash('changePasswordMessage')
      });
};

exports.post_change_password = function(req, res) {
    async.waterfall([
        function (done) {
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

          User.findById(req.user._id, function (err, user) {
            if (!user.is_valid_password(req.body.currentpass)) {
              req.flash('changePasswordMessage', 'Current password is not match.');
              console.log('=====> Error in change password');
              return res.redirect('back');
            }
            user.password = user.generate_hash(req.body.newpass);
            user.save(function (err) {
              done(err, user);
            });
          });
        },
        function (user, done) {
          let mail_options = {
            to: user.email,
            subject: 'Change Password Email',
            user: user,
            email: true
          };
          app.mailer.send('emailchange', mail_options, function (err, message) {
            if (err) {
              console.log(err);
            } else {
              console.log('Email sent');
              res.redirect('/');
            }
          });
        }
      ],
      function (err) {
        console.log('redirecting...');
        res.redirect('/');
      });
};

exports.get_change_profile = function(req, res) {
    res.render('changeprofile', {
        login_page: true,
        error_message: req.flash('changeProfileMessage'),
        user: req.user
      });
};

exports.post_change_profile = function(req, res) {
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
      req.login(user, function (err) {
        if (err) {
          console.log(err);
          return;
        } else {
          console.log('Change profile successful!');
          res.redirect('/profile');
        }
      });
    });
};