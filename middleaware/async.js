module.exports = function (handler) {
    return async (request,response,next) => {
        try{
            handler(request,response);
        }catch(err){
            next(err);
        }
    };
}