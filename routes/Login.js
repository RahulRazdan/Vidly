const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const express = require('express');
const {User,validatePassword} = require('../models/User');
const Joi = require('joi');
const router = express.Router();

router.post('/',async (request,response) => {
    let result = validate(request.body);

    if(result.error)
        return response.status(400).send(result.error.details[0].message);

    result = validatePassword(request.body.password);

    if(result.error)
        return response.status(400).send('Password does not meet required complexity');

    let user = await User.findOne({ email : request.body.email});

    if(!user)
        return response.status(400).send('Incorrect email or password');

    const match = await bcrypt.compare(request.body.password,user.password);
    
    if(!match)
        return response.status(400).send('Login Failed !!');
    
    const token = user.generateAuthToken();
    response.send(token);
});

function validate(user){
    const schema = {
        email : Joi.string().max(255).required().email(),
        password : Joi.string().max(255).required()
    };   

    return Joi.validate(user,schema);
}
module.exports = router;