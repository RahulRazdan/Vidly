
const mongo = require('mongoose');
const winston = require('winston');
const config = require('config');

module.exports = function(){
    const dbURL = config.get('db');
    mongo.connect(dbURL)
    .then(()=> winston.info(`Connected to ${dbURL}...`));
}