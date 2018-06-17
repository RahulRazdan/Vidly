const Joi = require('joi');
const moment = require('moment');
const mongo = require('mongoose');
const movieSchema = require('./Movie')

const rentalSchema = new mongo.Schema({
    customer : {
        type : mongo.Schema({
            name : {
                type:String,
                required : true,
                trim : true,
                max : 255
            },
            isGold : {
                type : Boolean,
                required:true
            },
            phone : {
                type:Number,
                required:true,
                min : 10
            }
        }),
        required : true
    },
    movie :{
        type : movieSchema,
        required: true
    },
    dateOut :{
        type : Date,
        required : true,
        default : Date.now
    },
    dateReturned : Date,
    rentalFee : {
        type : Number,
        min : 0
    }
});

rentalSchema.statics.lookup = function(rentalId){
    return this.findOne({
        //"customer._id" : request.body.customerId,
        //"movie._id" : request.body.movieId,
        "_id" : rentalId
    });
}

rentalSchema.methods.return = function(){
    this.dateReturned = new Date();
    const diff  = moment().diff(this.dateOut,'days');
    this.rentalFee = this.movie.dailyRentalRate * diff;
}

const Rental = mongo.model('Rental',rentalSchema);

function validateRental(rental){
    const schema = {
        customer : {
            name:  Joi.string().required(),
            isGold : Joi.boolean().required(),
            phone : Joi.number().required()
        },
        movieId : Joi.objectId().required()
    };

    return Joi.validate(rental,schema);
}

exports.validate = validateRental;
exports.Rental = Rental;