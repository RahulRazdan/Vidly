const Joi = require('joi');
const mongo = require('mongoose');
const moment = require('moment');
const express = require('express');
const auth = require('../middleaware/login');
const validation = require('../middleaware/validation');
const {Rental,validate} = require('../models/Rental');
const {Movie} = require('../models/Movie');
const router = express.Router();

function validateRental(rental){
    const schema = {
        customerId : Joi.objectId().required(),
        movieId : Joi.objectId().required(),
        rentalId : Joi.objectId().required()
    };

    return Joi.validate(rental,schema);
}

router.post('/',[auth,validation(validateRental)],async(request,response) => {

    const rental = await Rental.lookup(request.body.rentalId);

    if(!rental)
        return response.status(404).send('Rental Id not found.');
    
    if(rental.dateReturned)
        return response.status(400).send('Rental already processed.');

    rental.return();

    rental.movie.numberInStock += 1;
    await rental.save();

    response.send(rental);
});

module.exports = router;