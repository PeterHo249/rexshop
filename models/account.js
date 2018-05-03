var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AccountSchema = new Schema({
    username: {
        type: String,
        required: true,
        maxlength: 20
    },
    password: {
        type: String,
        required: true
    },
    user_id: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    }
});

//Export model
module.exports = mongoose.model('Account', AccountSchema);