const mongoose = require('mongoose');
const Trade = require('./trade.model.js');

const PortfolioSchema = mongoose.Schema({
    ticker: String,
    averagePrice: Number,
    shares: Number,
    trades: [{ tradeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trade' } }]
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);