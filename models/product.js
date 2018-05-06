var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    receipt_price: {
        type: Number,
        required: true,
        min: [0, 'invalid price']
    },
    market_price: {
        type: Number,
        required: true,
        min: [0, 'invalid price']
    },
    inventory_count: {
        type: Number,
        required: true,
        min: [0, 'invalid count']
    },
    brand: {
        type: String
    },
    type: {
        type: String,
        enum: ['camera/dslr', 'camera/mirrorless', 'camera/compact', 'camera/len', 'accessory/tripod', 'accessory/battery', 'accessory/card', 'accessory/backpack', 'camera/action'],
        required: true
    }
});

ProductSchema.virtual('url')
    .get(function () {
        return 'product/item/' + this._id;
    });

//Export model
module.exports = mongoose.model('Product', ProductSchema);