/* jshint esversion: 6 */
var express = require('express');
var router = express.Router();
var auth = require('../config/auth');
var User = require('../models/user');
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

  app.post('/changepassword', function(req, res) {
    
  });
};