
const auth = require('../../../middleaware/login');
const {User} = require('../../../models/User');

describe('Auth Middleware',()=>{

    it('should populate request.user with decoded user',()=>{
        const token = new User().generateAuthToken();

        const request = {
            header : jest.fn().mockReturnValue(token)
        };
        const response = {};
        const next = jest.fn();

        auth(request,response,next);
        
        expect(request.user).toBeDefined();
    });
});