
module.exports = function(validator){
    return (request,response,next) =>{
    const result = validator(request.body);

    if(result.error)
        return response.status(400).send(result.error.details[0].message);

    next();
    }

}