/* jshint esversion: 6 */

module.exports = function (app, passport) {
  /* GET home page. */
  app.get('/', function (req, res, next) {
    //res.render('index', { title: 'Express' });
    res.redirect('/product');
  });

  app.get('/item/:id', function (req, res, next) {
    res.redirect('/product/item/' + req.params.id);
  });

  app.get('/login', function (req, res, next) {
    res.render('login', {
      login_page: true,
      message: req.flash('loginMessage')
    });
  });

  app.get('/signup', function (req, res, next) {
    res.render('signup', {
      login_page: true,
      message: req.flash('signupMessage')
    });
  });

  app.post('/login', passport.authenticate('local-login', {
    failureRedirect: '/login',
    failureFlash: true
  }), function(req, res, next) {
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
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
}