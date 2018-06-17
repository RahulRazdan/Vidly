const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongo = require('mongoose');
const PasswordComplexity = require('joi-password-complexity');

const complexityOptions = {
    min: 5,
    max: 30,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 2,
  }

const userSchema = new mongo.Schema({
    name : {
       type : String,
       required : true,
       trim : true,
       min : 5,
       max : 255
    },
    email : {
       type : String,
       required : true,
       trim : true,
       max : 255,
       unique : true
    },
    password : {
        type : String,
        required : true,
        trim : true,
        max : 1024
    },
    isAdmin : Boolean
   });

userSchema.methods.generateAuthToken = function(){
    console.log('creating token');
    const token =  jwt.sign({ _id : this._id , isAdmin : this.isAdmin},config.get('jwtPrivateKey'));
    return token;
}
const User = mongo.model('User',userSchema);

function validatePassword(password){
    return Joi.validate(password, new PasswordComplexity(complexityOptions));
}
function validateUser(user){
    const schema = {
        name : Joi.string().min(5).max(50).required(),
        email : Joi.string().max(255).required().email(),
        password : Joi.string().max(255).required()
    };   

    return Joi.validate(user,schema);
}

exports.User = User;
exports.validate = validateUser;
exports.validatePassword = validatePassword;