/* jshint esversion: 6 */

let LocalStrategy = require('passport-local').Strategy;
let user = require('../models/user');
let bCrypt = require('bcrypt-nodejs');

module.exports = function(passport) {
    passport.use('login', new LocalStrategy({
        passReqToCallback: true
    },
    function(req, username, password, done) {
        user.findOne({'username': username}, function(err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                console.log('User not found with username ' + username);
                return done(null, false, req.flash('message', 'User Not Found!'));
            }

            if (!isValidPassword(user, password)) {
                console.log('Invalid Password');
                return done(null, false, req.flash('message', 'Invalid Password'));
            }

            return done(null, user);
        });
    }));

    let isValidPassword = function(user, password) {
        return bCrypt.compareSync(password, user.password);
    };
};