/* jshint esversion: 6 */

let LocalStrategy = require('passport-local').Strategy;
let User = require('../models/user');

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, username, password, done) {
            process.nextTick(function () {
                req.checkBody('fullname', 'Fullname is required.').notEmpty();
                req.checkBody('username', 'Username is required.').notEmpty();
                req.checkBody('password', 'Password is required.').notEmpty();
                req.checkBody('password', 'Password must have 8 - 32 lettets.').isLength({
                    min: 8
                }).isLength({
                    max: 32
                });
                req.checkBody('repassword', 'Re-enter Password is required').notEmpty();
                req.checkBody('repassword', 'Re-enter Password have to be the same the password').isEqual(req.body.password);
                req.checkBody('email', 'Valid is mail is required.').isEmail();
                req.checkBody('address', 'Address is required.').notEmpty();
                req.checkBody('phoneno', 'Phone number is required.').notEmpty();

                var errors = req.validationErrors();
                if (errors) {
                    let message = '';
                    errors.forEach(error => {
                        message = message + error.msg + '<br>';
                    });
                    message = message + 'Please complete requirement!';
                    return done(null, false, req.flash('signupMessage', message));
                }

                User.findOne({
                    'username': username
                }, function (err, user) {
                    if (err) {
                        return done(err);
                    }

                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                    } else {
                        let newUser = new User();

                        newUser.username = username;
                        newUser.password = newUser.generate_hash(password);
                        newUser.name = req.body.fullname;
                        newUser.address = req.body.address;
                        newUser.phone_number = req.body.phoneno;
                        newUser.email = req.body.email;
                        newUser.code = generate_random_int(10000) + username;

                        newUser.save(function (err) {
                            if (err) {
                                throw (err);
                            }

                            return done(null, newUser);
                        });
                    }
                });
            });
        }));

    passport.use('local-login', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, username, password, done) {
            User.findOne({
                'username': username
            }, function (err, user) {
                if (err) {
                    return done(err);
                }

                if (!user) {
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                }

                if (!user.is_valid_password(password)) {
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                }

                return done(null, user);
            });
        }));
};

function generate_random_int(max) {
    return Math.floor(Math.random() * Math.floor(max));
}