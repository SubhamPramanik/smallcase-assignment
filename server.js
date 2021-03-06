const express = require('express');
const bodyParser = require('body-parser');

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// define a simple route
app.get('/', (req, res) => {
    res.json({
        "message": "smallcase backend development intern assignment.",
        "GitHub": "https://github.com/SubhamPramanik/smallcase-assignment",
        "ReadMe": "https://github.com/SubhamPramanik/smallcase-assignment/blob/master/README.md"
    });
});

// Require trade routes
require('./app/routes/trade.routes.js')(app);

// Globals
const PORT = process.env.PORT || 3000;

// listen for requests
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});