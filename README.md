# smallcase-assignment

smallcase assignment based on Node.js and MongoDB for Backend development intern. 
  - NodeJS
  - MongoDB
  - Mongoose ORM
  - Express framework
  - POSTman for testing

> Website: https://murmuring-plains-00067.herokuapp.com/

# API Routings

### 1. Adding Trades

  - /trades
  - POST method

#### Trade Schema:

```sh
    {
        "ticker": String,
        "action": buy/sell,
        "quantity": Number,
        "price": Number
    }
```
  -  Validation added for ticker, action (buy or cell), quantity (positive), price
  - Portfolio addition/creation

### 2. Updating Trades

  - /trades/:tradeId
  - PUT method
  -  Validation added for ticker (has to be same), action (has to be same), quantity (sell quantity cannot be less than holding), price
  - Portfolio updation
  
  ```sh
    {
        "ticker": String,
        "action": String,
        "quantity": Number,
        "price": Number
    }
```
### 3. Deleting Trades

  - /trades/:tradeId
  - DELETE method
  - Portfolio updation
  - Restoration of quantity and price
 
### 4. Fetching Portfolio

  - /portfolio
  - GET method

#### Portfolio Schema:

```sh
    {
        "_id": mongoose.Schema.Types.ObjectId,
        "ticker": String,
        "averagePrice": Number,
        "shares": Number,
        "trades": [
            {
                "_id": mongoose.Schema.Types.ObjectId,
                "tradeId": _id of trade
            }
        ],
        "__v": 0
    }
```
### 5. Fetching Holdings
 - /holdings
  - GET method
  
#### Holding Schema:
```sh
    {
        "ticker": String,
        "averagePrice": Number,
        "shares": Number,
    }
```
  
### 6. Fetching Returns
 - /returns
 - GET method
  
#### Returns Schema:
```sh 
{
    "Return for each": [
        {
            "_id": mongoose.Schema.Types.ObjectId,
            "ticker": String,
            "averagePrice": Number,
            "shares": Number,
            "return": Number
        }
    ],
    "Total return": Number
}
```
### 7. Fetching All Trades

 - /allTrades
 - GET Method
 
#### Trade Schema
```sh
{
        "_id": mongoose.Schema.Types.ObjectId,
        "ticker": String,
        "action": buy/sell,
        "quantity": Number,
        "price": Number,
        "createdAt": DateTime,
        "updatedAt": DateTime,
        "__v": 0
    }
```
# Design Decisions
 - Config file for database configuration.
 - Separate files for models, controllers and routes.
 - Trade and Portfolio separation.
 - Holdings derived from Portfolio.
 - Return response provides Security wise returns and at last cumulative return.
 - Validation for corner cases.
 - Use of variables to plug in external APIs

# Tests To Run
 - Concurrent addition and deletion test
 - Test for corner cases such as negative values etc
 - Trade modification possibility
 - Null value tests
 - Object binding tests

# Improvements
 - More modularity
 - Better controller design
 - Reduction in code repetation
 - Separation of concern based on activity
  
> Contact at subhampramanik@gmail.com, 7980034456
> Subham Pramanik

