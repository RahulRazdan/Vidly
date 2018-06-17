
const mongo = require('mongoose');

module.exports = function(request,response,next){
    if(!mongo.Types.ObjectId.isValid(request.params.id))
        return response.status(404).send('Invalid Genre Id');

    next();
}