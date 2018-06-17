const express = require('express');
const {Movie,validate} = require('../models/Movie');
const {Genre} = require('../models/Genre');
const router = express.Router();

router.get('/',async (request,response)=>{
    const movies = await Movie.find().select();
    response.send(movies);
});

router.post('/',(request,response)=>{
    
    let result = validate(request.body);
    if(result.error)
        return response.status(400).send(result.error.details[0].message);
       
    createMovie(request.body,response);
});

async function createMovie(request,response){
    
    try{
        let genre = await Genre.findById(request.genreId);
        if(!genre)
            return response.status(400).send('Invalid GENRE...');
        
        const movie = new Movie({
            title : request.title,
            numberInStock : request.numberInStock,
            genre : {
                _id : genre._id,
                name : genre.name
            },
            dailyRentalRate : request.dailyRentalRate
        });

        result = await movie.save();
        response.send(result);
    }catch(ex){
        response.status(404).send(ex.message);
    }
}

module.exports = router;