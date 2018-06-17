const mongo = require('mongoose');
const express = require('express');
const {Rental,validate} = require('../models/Rental');
const {Movie} = require('../models/Movie');
const router = express.Router();
const Fawn = require('fawn');

Fawn.init(mongo);

router.get('/',async(request,response) => {
    const result =  await Rental.find().select();
    response.send(result);
});

router.post('/',async (request,response) => {
    let result = validate(request.body);

    if(result.error)
        return response.status(400).send(result.error.details[0].message);

    const movie = await Movie.findById(request.body.movieId);

    if(!movie)
        return response.status(400).send('Movie Not Found!!');

    if(movie.numberInStock == 0 )
        return response.status(400).send('Movie Not in stock!!');

    const rental = new Rental({
        movie : movie,
        customer : {
            name : request.body.customer.name,
            isGold : request.body.customer.isGold,
            phone : request.body.customer.phone
        }
    });

    new Fawn.Task()
        .save('rentals',rental)
        .update('movies',{ _id : movie._id},{
            $inc :{
                numberInStock : -1
            }
        })
        .run();

 /*   result = await rental.save();

    movie.numberInStock--;
    await movie.save(); */  

    response.send(rental);
});

module.exports = router;