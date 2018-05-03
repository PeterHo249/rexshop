var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 100
    },
    address: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true,
        maxlength: 11 
    },
    role: {
        type: String,
        enum: ['customer', 'salesman', 'manager'],
        required: true,
        default: 'customer'
    }
});

//Export model
module.exports = mongoose.model('User', UserSchema);