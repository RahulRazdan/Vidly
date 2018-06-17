const Joi = require('joi');
const mongo = require('mongoose');

const genreSchema = new mongo.Schema({
    name : {
        type : String,
        required : true,
        enum : [
            'SCI-FI',
            'DRAMA'
        ]
    }
});

const Genre = mongo.model('Genre',genreSchema);

function validateGeneres(genre){
    const schema = {
        genreId : Joi.string().valid('SCI-FI','DRAMA').required()
    };

    return Joi.validate(genre,schema);
}

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validateGenre = validateGeneres;