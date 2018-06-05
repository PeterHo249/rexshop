/* jshint esversion: 6 */

exports.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
  
    res.redirect('/login');
  }