const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const hpp = require('hpp');

const {logger} = require('./logger');

const start = function (app) {
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(hpp());
    app.use(function (req, res, next) {
        next();
    });
    app.listen(process.env.EXPRESS_PORT,()=>{
        logger.info(`express listening on port ${process.env.EXPRESS_PORT}`)
    });
};

module.exports = 
{
    start
};