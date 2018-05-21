/* jshint esversion: 6 */
let express = require('express');
let router = express.Router();

let isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
};

module.exports = function (passport) {
  /* GET home page. */
  router.get('/', function (req, res, next) {
    //res.render('index', { title: 'Express' });
    res.redirect('/product');
  });

  router.get('/item/:id', function (req, res, next) {
    res.redirect('/product/item/' + req.params.id);
  });

  router.get('/login', function (req, res, next) {
    res.render('login', {
      login_page: true
    });
  });

  router.get('/signup', function (req, res, next) {
    res.render('signup', {
      login_page: true
    });
  });

  router.post('/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }));

  router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/login',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });
  
  return router;
}