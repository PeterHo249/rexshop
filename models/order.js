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
        min: 0
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
    count: {
        type: Number,
        default: 0
    },
    address: {
        type: String
    },
    item_list: [{
        item: {
            type: Schema.ObjectId,
            ref: 'product'
        },
        amount: Number
    }]
});

//Export model
module.exports = mongoose.model('Order', OrderSchema);