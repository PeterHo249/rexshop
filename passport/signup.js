/* jshint esversion: 6 */

let LocalStrategy = require('passport-local').Strategy;
let user = require('../models/user');
let bCrypt = require('bcrypt-nodejs');

module.exports = function(passport) {
    passport.use('signup', new LocalStrategy({
        passReqToCallback: true
    }, function(req, username, password, done) {
        findOrCrateUser = function() {
            user.findOne({'username': username}, function(err, user) {
                if (err) {
                    console.log('Error in SignUp: ' + err);
                    return done(err);
                }

                if (user) {
                    console.log('User already exist with username: ' + username);
                    return done(null, false, req.flash('message', 'User Already Exist'));
                } else {
                    let newUser = new user();

                    newUser.username = username;
                    newUser.password = createHash(password);

                    newUser.save(function(err) {
                        if (err) {
                            console.log('Error in saving user ' + err);
                            throw err;
                        }

                        console.log('User Registration Successful');
                        return done(null, newUser);
                    });
                }
            });
        };
        process.nextTick(findOrCrateUser);
    }));

    let createHash = function(password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };
};