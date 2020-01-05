const mongoose = require('mongoose');

const TradeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    ticker: String,
    action: String,
    quantity: Number,
    price: Number
}, {
    timestamps: true
});

module.exports = mongoose.model('Trades', TradeSchema);