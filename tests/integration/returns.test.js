
const moment = require('moment');
const {Rental} = require('../../models/Rental');
const {User} = require('../../models/User');
const mongoose = require('mongoose');
const request = require('supertest');

describe('/api/returns',()=>{

    let server;
    let customerId;
    let token;
    let movieId;
    let rental;
    let payload;

    beforeEach(async ()=>{
        server = require('../../index');
        token = new User({isAdmin : true}).generateAuthToken();
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        rentalId = mongoose.Types.ObjectId();
        payload = {
            customerId,
            movieId,
            rentalId
        };

        rental = new Rental({
            _id : rentalId,
            customer : {
                _id : customerId,
                name : 'Rahul Razdan',
                isGold : true,
                phone : 1231231231
            },
            movie : {
                _id : movieId,
                title : 'Horror Movie',
                genre : {
                    name : 'SCI-FI'
                },
                numberInStock : 10,
                dailyRentalRate : 20
            }
        });

        await rental.save();
   });
   
   afterEach(async ()=>{ 
       await server.close();
       await Rental.remove({});
   });

   const exec = function () {
        return request(server)
            .post('/api/returns')
            .set('x-auth-token',token)
            .send(payload);
   }
   it('should work', async ()=>{
        const response = await Rental.findById(rental._id);
        expect(response).not.toBeNull();
   });

   it('should return 401 if client is not logged in',async()=>{
        token = '';
        const response = await exec();
        expect(response.status).toBe(401);
   });

    it('should return 400 if customerId not passed in request body',async()=>{
        delete payload.customerId;
        const response = await exec();    
        expect(response.status).toBe(400);
    });

    it('should return 400 if movieId not passed in request body',async()=>{
        delete payload.movieId;
        const response = await exec();    
        expect(response.status).toBe(400);
    });

    it('should return 404 if not rental found for this custoer/movie',async()=>{
        await Rental.remove({});
        const response = await exec();
        expect(response.status).toBe(404);
    });

    it('should return 400 if rental already processed',async()=>{
        rental.dateReturned = new Date();
        await rental.save();

        const response = await exec();
        expect(response.status).toBe(400);
    });

    it('should return 200 if valid request',async()=>{
        const response = await exec();
        expect(response.status).toBe(200);
    });

    it('should set the returned date',async()=>{
        const response = await exec();
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('dateReturned');
        expect(response.body.dateReturned).not.toBeNull();
    });

    it('should set calculate the rental fee',async()=>{
        rental.dateOut = moment().add(-7,'days').toDate();
        await rental.save();

        const response = await exec();
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('rentalFee');
        expect(response.body.rentalFee).not.toBeNull();
        expect(response.body.rentalFee).toBe(140);
    });

    it('should increase the stock by 1',async()=>{
        const intialStock = rental.movie.numberInStock;

        const response = await exec();
        expect(response.status).toBe(200);
        expect(response.body.movie.numberInStock).toBe(intialStock+1);
    });
    
    it('should return rental object',async()=>{
        const intialStock = rental.movie.numberInStock;

        const response = await exec();

        const rentalDB = await Rental.findById(rental._id);

        expect(response.status).toBe(200);
        /*expect(response.body).toHaveProperty('rentalFee');
        expect(response.body).toHaveProperty('dateOut');
        expect(response.body).toHaveProperty('dateReturned');
        expect(response.body).toHaveProperty('customer');
        expect(response.body).toHaveProperty('movie');*/

        expect(Object.keys(response.body)).toEqual(expect.arrayContaining([
            'rentalFee',
            'dateOut',
            'dateReturned',
            'customer',
            'movie'
        ]));
    });
});