var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var OrderSchema = new Schema({
    staff_id: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    customer_id: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    cost: {
        type: Number,
        min: 0,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Done', 'Processing', 'Waiting'],
        required: true,
        default: 'Waiting'
    },
    shopping: {
        type: Boolean,
        default: true,
        required: true
    },
    count: {
        type: Number,
        default: 0
    }
});

//Export model
module.exports = mongoose.model('Order', OrderSchema);