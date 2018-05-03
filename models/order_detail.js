var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var OrderDetailSchema = new Schema({
    order_id: {
        type: Schema.ObjectId,
        ref: 'Order',
        required: true
    },
    product_id: {
        type: Schema.ObjectId,
        ref: 'Product',
        required: true
    },
    amount: {
        type: Number,
        min: 0
    }
});

//Export model
module.exports = mongoose.model('OrderDetail', OrderDetailSchema);