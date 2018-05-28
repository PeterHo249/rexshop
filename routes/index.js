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
      login_page: true
    });
  });

  app.get('/signup', function (req, res, next) {
    res.render('signup', {
      login_page: true
    });
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }));

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/login',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });
};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
}