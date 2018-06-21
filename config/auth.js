/* jshint esversion: 6 */

exports.isLoggedIn = function (role) {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      if (req.user.role === role || role === '*') {
        return next();
      }
    }

    res.redirect('/login');
  };
};