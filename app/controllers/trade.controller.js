const Trade = require('../models/trade.model.js');
const Portfolio = require('../models/portfolio.model.js');
const Returns = require('../models/returns.model.js');
const mongoose = require('mongoose');

// Create and Save a new Trade
exports.create = (req, res) => {

    // Validate request
    validator(req, res);

    // Create a Trade
    const trade = new Trade({
        _id: mongoose.Types.ObjectId(),
        ticker: req.body.ticker,
        action: req.body.action,
        quantity: req.body.quantity,
        price: req.body.price
    });

    //Portfolio Update
    Portfolio.findOne({ ticker: req.body.ticker })
        .then((doc) => {
            if (doc) {

                // console.log("Inside findOne");

                const portfolio = new Portfolio({
                    ticker: doc.ticker,
                    averagePrice: doc.averagePrice,
                    shares: doc.shares,
                    trades: doc.trades
                });

                if (req.body.action === 'sell') {
                    // console.log("Inside sell");
                    if (parseInt(doc.shares) > parseInt(req.body.quantity)) {

                        // console.log("Inside quantity check");

                        var fShares = parseInt(portfolio.shares) - parseInt(req.body.quantity);
                        portfolio.trades.push({ tradeId: trade._id });

                        Portfolio.findOneAndUpdate({"ticker": req.body.ticker}, {"$set": {"shares": fShares, "trades": portfolio.trades}}, {new:true}).exec(function(err, port){
                            if (err) {
                                res.status(500).send(err);
                            } else {
                                res.status(200).send(port);
                            }
                        });

                    } else {
                        res.status(500).send({
                            message: "Sell quantity is more than available shares."
                        });
                    }
                } else {

                    // console.log("Inside buy");

                    var fShares = parseInt(portfolio.shares) + parseInt(req.body.quantity);
                    var fPrice = ((parseInt(portfolio.averagePrice) * parseInt(portfolio.shares)) + (parseInt(req.body.price) * parseInt(req.body.quantity)))/(parseInt(req.body.quantity) + parseInt(portfolio.shares));
                    
                    portfolio.trades.push({ tradeId: trade._id });

                    Portfolio.findOneAndUpdate({"ticker": req.body.ticker}, {"$set": {"shares": fShares, "averagePrice": fPrice, "trades": portfolio.trades}}, {new:true}).exec(function(err, port){
                            if (err) {
                                res.status(500).send(err);
                            } else {
                                res.status(200).send(port);
                            }
                        });

                }

            } else {

                // console.log("Inside create portfolio");

                var arr = [];
                arr.push({ tradeId: trade._id });
                
                const portfolio = new Portfolio({
                    ticker: trade.ticker,
                    averagePrice: trade.price,
                    shares: trade.quantity,
                    trades: arr
                });

                portfolio.save()
                .then(data => {
                    res.send(data);
                }).catch(err => {
                    res.status(500).send({
                        message: err.message || "Error creating portfolio."
                    });
                });

            }
        });

    // Save Trade in the database
    trade.save();

};



// Retrieve and return portfolio from the database.
exports.findAll = (req, res) => {
    Portfolio.find()
    .then(doc => {
        res.send(doc);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving portfolio."
        });
    });
};



// Retrive all trades placed
exports.allTrades = (req, res) => {
    Trade.find()
    .then(doc => {
        res.send(doc);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving portfolio."
        });
    });
};



// Update a trade identified by the tradeId in the request
exports.update = (req, res) => {

    // console.log(req.body);
    // Validate request
    validator(req, res);

    Trade.findById(req.params.tradeId)
    .then(trade => {
        if(!trade) {
            return res.status(404).send({
                message: "Trade not found"
            });
        }

        if (trade.ticker != req.body.ticker || trade.action != req.body.action) {
            return res.status(205).send({
                message: "Ticker or Action cannot be modified"
            });
        }

        Portfolio.findOne({ ticker: req.body.ticker })
        .then((doc) => {
            if (doc) {
                // console.log("Inside doc");
                // console.log(doc);
                if (req.body.action === 'sell') {
                    // console.log("Inside sell");
                    if ((parseInt(doc.shares) + parseInt(trade.quantity)) >= parseInt(req.body.quantity)) {
                        // console.log("Inside sell approve");
                        var fShares = (parseInt(doc.shares) + parseInt(trade.quantity)) - parseInt(req.body.quantity);
                        Portfolio.findOneAndUpdate({"ticker": req.body.ticker}, {"$set": {"shares": fShares}}, {new:true}).exec(function(err, port){
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("Portfolio Updated");
                            }
                        });
                    } else {
                        // console.log("Inside sell decline");
                        return res.status(500).send({
                            message: "Sell quantity is more than available shares."
                        });
                    }
                } else {

                    // console.log("Inside buy");
                    // console.log(doc.shares + " " + trade.quantity + " " + req.body.quantity);
                    // console.log(doc.averagePrice + " " + trade.price + " " + req.body.price);

                    var fShares = parseInt(doc.shares) - parseInt(trade.quantity) + parseInt(req.body.quantity);
                    var fPrice = ((parseInt(doc.averagePrice) * parseInt(doc.shares)) - (parseInt(trade.quantity) * parseInt(trade.price)) + (parseInt(req.body.quantity) * parseInt(req.body.price))) / ((parseInt(doc.shares) - parseInt(trade.quantity) + parseInt(req.body.price)));
                    
                    // console.log(fShares + " " + fPrice);

                    Portfolio.findOneAndUpdate({"ticker": req.body.ticker}, {"$set": {"shares": fShares, "averagePrice": fPrice}}, {new:true}).exec(function(err, port){
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("Portfolio Updated");
                        }
                    });
                }
            }
        });

        Trade.findByIdAndUpdate(req.params.tradeId, req.body, {new: true})
                .then(trade => {
                    if(!trade) {
                        return res.status(404).send({
                            message: "Trade not found with id " + req.params.tradeId
                        });
                    }
                    res.send(trade);
                }).catch(err => {
                    if(err.kind === 'ObjectId') {
                        return res.status(404).send({
                            message: "Trade not found with id " + req.params.tradeId
                        });                
                    }
                    return res.status(500).send({
                        message: "Error updating trade with id " + req.params.tradeId
                    });
                });


    });

};

// Delete a trade with the specified tradeId in the request
exports.delete = (req, res) => {

    Trade.findById(req.params.tradeId)
    .then(trade => {
        if(!trade) {
            return res.status(404).send({
                message: "Trade not found"
            });
        }

        Portfolio.findOne({ ticker: trade.ticker })
        .then((doc) => {
            if (doc) {
                // console.log("Inside doc");
                // console.log(doc);
                if (trade.action === 'sell') {
                    // console.log("Inside sell");
                    var fShares = parseInt(doc.shares) + parseInt(trade.quantity);
                    var fTrades = doc.trades;
                    console.log(fTrades);
                    fTrades.splice(fTrades.indexOf(req.params.tradeId), 1);

                    console.log(fTrades);
                    Portfolio.findOneAndUpdate({"ticker": trade.ticker}, {"$set": {"shares": fShares, "trades": fTrades }}, {new:true}).exec(function(err, port){
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("Portfolio Updated");
                        }
                    });

                } else {
                    // console.log("Inside buy");
                    var fShares = parseInt(doc.shares) - parseInt(trade.quantity);
                    var fPrice = (parseInt(doc.averagePrice) * parseInt(doc.shares)) - (parseInt(trade.quantity) * parseInt(trade.price)) / (parseInt(doc.shares) - parseInt(trade.quantity));
                    var fTrades = doc.trades;
                    console.log(fTrades);
                    fTrades.splice(fTrades.indexOf(req.params.tradeId), 1);

                    console.log(fTrades);
                    // console.log(fShares + " " + fPrice);

                    Portfolio.findOneAndUpdate({"ticker": trade.ticker}, {"$set": {"shares": fShares, "averagePrice": fPrice, "trades": fTrades}}, {new:true}).exec(function(err, port){
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("Portfolio Updated");
                        }
                    });

                }
            }
        });

        Trade.findByIdAndRemove(req.params.tradeId)
                .then(trade => {
                    if(!trade) {
                        return res.status(404).send({
                            message: "Trade not found with id " + req.params.tradeId
                        });
                    }
                    res.send({message: "Trade deleted successfully!"});
                }).catch(err => {
                    if(err.kind === 'ObjectId' || err.name === 'NotFound') {
                        return res.status(404).send({
                            message: "Trade not found with id " + req.params.tradeId
                        });                
                    }
                    return res.status(500).send({
                        message: "Error updating trade with id " + req.params.tradeId
                    });
                });

    });


};


// Holdings: List of securities with details
exports.holdings = (req, res) => {

    Portfolio.find({}, { trades: 0, _id: 0, __v: 0 })
    .then(trade => {
        res.send(trade);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving trades."
        });
    });

};


// Calculate returns for each stock at selling price of 100
exports.returns = (req, res) => {

    var totalRets = 0;

    Portfolio.find({}, { trades: 0, _id: 0, __v: 0 })
    .then(trade => {

        var retsQueue = [];
        var rets = 0;

        trade.forEach(x => {
            const currPrice = 100;
            // console.log(currPrice + " " + x.averagePrice + " " + x.shares);
            rets = (parseInt(currPrice) - parseInt(x.averagePrice))*parseInt(x.shares);

            const ret = new Returns({
                ticker: x.ticker,
                averagePrice: x.averagePrice,
                shares: x.shares,
                return: rets
            });

            totalRets = parseInt(totalRets) + parseInt(rets);

            // retsQueue.push({
            //     ticker: x.ticker,
            //     return: rets
            // });

            retsQueue.push(ret);

        });

        res.send({
            "Return for each": retsQueue,
            "Total return": totalRets
        });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving trades."
        });
    });
};



//  Common validator for request
validator = (req, res) => {

    // Validate request
    if(!req.body.ticker) {
        return res.status(400).send({
            message: "Ticker can not be empty"
        });
    }

    if(!req.body.action || !req.body.action.match(/\bbuy\b|\bsell\b/g)) { //check once
        return res.status(400).send({
            message: "Provide buy/sell action"
        });
    }

    if(!req.body.quantity || req.body.quantity <= 0) {
        return res.status(400).send({
            message: "Quantity can not be empty or negative"
        });
    }

    if(!req.body.price || req.body.price < 0) {
        return res.status(400).send({
            message: "Price can not be empty or negative"
        });
    }

    return true;
}