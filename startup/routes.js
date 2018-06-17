const movie = require('../routes/Movie')
const genre = require('../routes/Genre')
const rental = require('../routes/Rental')
const returns = require('../routes/Returns')
const user = require('../routes/User')
const login = require('../routes/Login')
const express = require('express');
const myerror = require('../middleaware/error');

module.exports = function(app){

    app.use(express.json());
    app.use('/api/movies',movie);
    app.use('/api/genres',genre);
    app.use('/api/rentals',rental);
    app.use('/api/users',user);
    app.use('/api/login',login);
    app.use('/api/returns',returns);
    app.use(myerror);

}