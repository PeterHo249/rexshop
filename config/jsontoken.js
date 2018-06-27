/* jshint esversion: 6 */
let jwt = require('jsonwebtoken');

let token_key = 'secret key for token';
exports.generate_token = function (object) {
    return jwt.sign(object, token_key);
};

exports.decode_token = function (token) {
    return jwt.verify(token, token_key);
};