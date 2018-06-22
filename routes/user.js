/* jshint esversion: 6 */
var auth = require('../config/auth');
const {
  check,
  validationResult
} = require('express-validator/check');
let user_controller = require('../controllers/userController');

module.exports = function (app, passport) {
  
  app.get('/profile', auth.is_logged_in('*'), user_controller.get_profile);
  app.get('/changepassword', auth.is_logged_in('*'), user_controller.get_change_password);
  app.post('/changepassword', auth.is_logged_in('*'), user_controller.post_change_password);
  app.get('/changeprofile', auth.is_logged_in('*'), user_controller.get_change_profile);
  app.post('/changeprofile', auth.is_logged_in('*'), user_controller.post_change_profile);
};