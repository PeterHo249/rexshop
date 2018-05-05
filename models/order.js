var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var OrderSchema = new Schema({
    staff_id: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    customer_id: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    order_type: {
        type: String,
        enum: ['in', 'out'],
        required: true,
        default: 'out'
    },
    cost: {
        type: Number,
        min: 0,
        required: true
    },
    date: {
        type: Date
    },
    status: {
        type: String,
        enum: ['Done', 'Processing', 'Waiting'],
        required: true,
        default: 'Waiting'
    }
});

//Export model
module.exports = mongoose.model('Order', OrderSchema);