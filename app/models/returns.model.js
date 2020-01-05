const mongoose = require('mongoose');

const ReturnSchema = mongoose.Schema({
    ticker: String,
    averagePrice: Number,
    shares: Number,
    return: Number
});

module.exports = mongoose.model('Returns', ReturnSchema);