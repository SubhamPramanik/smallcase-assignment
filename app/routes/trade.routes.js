module.exports = (app) => {
    const trades = require('../controllers/trade.controller.js');

    // Create a new Trade
    app.post('/trades', trades.create);

    // Update a Trade with tradeId
    app.put('/trades/:tradeId', trades.update);

    // Delete a Trade with tradeId
    app.delete('/trades/:tradeId', trades.delete);

    // Retrieve Portfolio
    app.get('/portfolio', trades.findAll);

    // Retrieve all trades
    app.get('/alltrades', trades.allTrades);

    // Retrieve Holdings
    app.get('/holdings', trades.holdings);

    // Retrive Returns
    app.get('/returns', trades.returns);
}