require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const framework = require('./helpers/framework');
const {logger} = require('fyrebrick-helper').helpers;
const routes = require('./routes');
try {
    mongoose.connect(process.env.DB_URI, {
        useCreateIndex: true,
        useUnifiedTopology: true,
        useNewUrlParser: true
    });
    mongoose.connection.on('open', async() => {
        logger.info(`mongodb connection opened at ${process.env.DB_URI}`);
        const app = express();
        framework.start(app);
        app.use('/',routes)
    })
    mongoose.connection.on('error', (error) =>{
        logger.error(`mongodb connection error: ${error}`);
    })
    mongoose.connection.on('close', () =>{
        logger.info(`mongodb connection closed at ${process.env.DB_URI}`);
    })
}catch(err){
    logger.error(`error caught: ${err}`);
}