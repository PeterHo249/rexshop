/* jshint esversion: 6 */
let jwt = require('jsonwebtoken');

let token_key = 'secret key for token';
exports.generateToken = function (object) {
    return jwt.sign(object, token_key);
};

exports.decodeToken = function (token) {
    return jwt.verify(token, token_key);
};