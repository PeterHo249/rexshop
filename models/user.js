var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: {
        type: String,
        //required: true,
        maxlength: 100
    },
    address: {
        type: String,
        //required: true
    },
    phone_number: {
        type: String,
        //required: true,
        maxlength: 11 
    },
    role: {
        type: String,
        enum: ['customer', 'salesman', 'manager'],
        //required: true,
        default: 'customer'
    },
    username: {
        type: String,
        required: true,
        maxlength: 20
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

//Export model
module.exports = mongoose.model('User', UserSchema);