/* jshint esversion: 6 */

let login = require('./login');
let signup = require('./signup');
let user = require('../models/user');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        console.log('serialize user: ' + user);
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        user.findById(id, function(err, user) {
            console.log('deserializing user: ' + user);
            done(err, user);
        });
    });

    login(passport);
    signup(passport);
};