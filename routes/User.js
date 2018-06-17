const jwt = require('jsonwebtoken');
const auth = require('../middleaware/login');
const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const express = require('express');
const {User,validate,validatePassword} = require('../models/User');
const router = express.Router();

router.get('/me',auth,async (request,response) => {
    const user  = await User.findById(request.user._id).select('-password');
    response.send(user);
});

router.post('/',async (request,response) => {
    let result = validate(request.body);

    if(result.error)
        return response.status(400).send(result.error.details[0].message);

    result = validatePassword(request.body.password);

    if(result.error)
        return response.status(400).send('Password does not meet required complexity');

    let user = await User.findOne({ email : request.body.email});

    if(user)
        return response.status(400).send('User is already registered!!');

    user = new User(_.pick(request.body,['name','email','password']));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt);

    await user.save();

    const token = user.generateAuthToken();

    response.header('x-auth-token',token).send(_.pick(user,['id','name','email']));
});

module.exports = router;