
const request = require('supertest');
const {Genre} = require('../../models/Genre');
const {User} = require('../../models/User');
const mongoose = require('mongoose');
let server;


describe('/api/genres',()=>{
    
    let token;
    let genreId;

    beforeEach(()=>{
         server = require('../../index');
         token = new User({isAdmin : true}).generateAuthToken();
         genreId = 'SCI-FI';
    });
    
    afterEach(async ()=>{ 
        await server.close();
        await Genre.remove({});
        await User.remove({});
    });

    const exec = async () => {
        return await request(server)
        .post('/api/genres')
        .set('x-auth-token',token)
        .send({ genreId });
    }

    describe('GET /',()=>{
        
        it('should give 401 if auth token not passed', async ()=>{
            token ='';
            const response = await request(server)
                                        .get('/api/genres');
            expect(response.status).toBe(401);
        });

        it('should return all genres', async ()=>{
            Genre.collection.insertMany([
                {name: 'genre1'},
                {name: 'genre2'}
            ]);
            
            const response = await request(server)
                                        .get('/api/genres')
                                            .set('x-auth-token',token);
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(2);
            expect(response.body.some (g => g.name === 'genre1')).toBeTruthy();
        });
    });

    describe('GET /:id',()=>{

        it('should return given ID genres', async ()=>{
            const genre = new Genre({
                name : 'SCI-FI'
            });
            await genre.save();

            const response = await request(server)
                                        .get('/api/genres/' + genre._id)
                                            .set('x-auth-token',token);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('name' , genre.name);
        });

        it('should return 404 with invalid ID genres', async ()=>{
            const response = await request(server)
                                        .get('/api/genres/1')
                                            .set('x-auth-token',token);
            expect(response.status).toBe(404);
        });

        it('should return 400 with genre id that does not exist in database', async ()=>{
            const id = mongoose.Types.ObjectId();
            const response = await request(server)
                                        .get('/api/genres/'+id)
                                            .set('x-auth-token',token);
            expect(response.status).toBe(400);
        });
    });

    describe('POST /',()=>{

        it('should give 400 if genre name not from enum',async ()=>{
            genreId = new Array(5).join('a');

            const response = await exec();
            
            expect(response.status).toBe(400);
        });

        it('should store valid genre into database',async ()=>{

            const response = await exec();

            const genre = await Genre.find({name : 'SCI-FI'});
            expect(genre).not.toBeNull();
        });

        it('should return valid genre ',async ()=>{

            const response = await exec();
            
            expect(response.body).toHaveProperty('_id');
            expect(response.body).toHaveProperty('name' , 'SCI-FI');
        });
    });

    describe('DELETE /',()=>{
        it('should give 400 for genre id does not exist in databse', async ()=>{
            const id = mongoose.Types.ObjectId();
            const response = await request(server).delete('/api/genres/'+id).set('x-auth-token',token);

            expect(response.status).toBe(400);
        });

        it('should give 200 for genre id exist in databse', async ()=>{
            
            let genre = new Genre({
                name : 'DRAMA'
            });
            
            genre = await genre.save();
            const response = await request(server).delete('/api/genres/'+genre._id).set('x-auth-token',token);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('_id');
            expect(response.body).toHaveProperty('name','DRAMA');
        });

    });
});