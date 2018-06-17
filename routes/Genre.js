const asyncMidleware = require('../middleaware/async');
const auth = require('../middleaware/login');
const admin = require('../middleaware/admin');
const validateObjectId = require('../middleaware/validateObjectId');
const express = require('express');
const { Genre, validateGenre } = require('../models/Genre');
const router = express.Router();

/*router.get('/', auth, asyncMidleware(async (request, response) => {
    const genre = await Genre.find().select();
    response.send(genre);
}));*/

router.get('/', auth, async (request,response) => {
    const genre = await Genre.find().select();
    response.send(genre);
});

router.post('/', auth, async (request,response) => {
    const result = validateGenre(request.body);

    if(result.error)
        return response.status(400).send(result.error.details[0].message);
        
    let genre = new Genre({
        name : request.body.genreId
    });
    
    genre = await genre.save();
    response.send(genre);
});

router.delete('/:id', [auth, admin], async (request, response) => {
    const genre = await Genre.findByIdAndRemove({ _id: request.params.id });
    if (!genre)
        return response.status(400).send('Invalid Genre Id');
    response.send(genre);
});

router.get('/:id', [auth, admin,validateObjectId], async (request, response) => {
    
    const genre = await Genre.findById({ _id: request.params.id });
    if (!genre)
        return response.status(400).send('Invalid Genre Id');
    response.send(genre);
});

module.exports = router;