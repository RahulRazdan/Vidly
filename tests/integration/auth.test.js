const request = require('supertest');
const {Genre} = require('../../models/Genre');
const {User} = require('../../models/User');
let server;


describe('/api/genres',()=>{
    
    let token;
    let genreId;

    beforeEach(()=>{
         server = require('../../index');
         token = new User({isAdmin : true}).generateAuthToken();
         genreId = 'SCI-FI';
    });
    
    afterEach( async()=>{ 
        await server.close();
        await Genre.remove({});
    });

    const exec = () => {
        return request(server)
        .post('/api/genres')
        .set('x-auth-token',token)
        .send({ genreId });
    }

    describe('POST /',()=>{

        it('should give 401 when x-atuh-token is not passed',async ()=>{
            token = '';
            const response = await exec();
            
            expect(response.status).toBe(401);
        });

        it('should give 400 when x-atuh-token is not invalid',async ()=>{
            token = 'a';
            const response = await exec();
            
            expect(response.status).toBe(400);
        });

        it('should give 200 when x-atuh-token is not valid',async ()=>{
            const response = await exec();
            
            expect(response.status).toBe(200);
        });
    });
});