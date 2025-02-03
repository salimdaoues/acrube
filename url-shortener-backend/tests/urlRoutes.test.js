import request from 'supertest';
import express from 'express';
import router from './routes/urlRoutes.js';

const app = express();
app.use(express.json());
app.use('/', router);

describe('API Endpoints', () => {
    test('POST /shorten - should shorten a valid URL', async () => {
        const response = await request(app)
            .post('/shorten')
            .send({ originalUrl: 'https://example.com' });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('shortUrl');
        expect(response.body).toHaveProperty('originalUrl', 'https://example.com');
    });

    test('POST /shorten - should reject an invalid URL', async () => {
        const response = await request(app)
            .post('/shorten')
            .send({ originalUrl: 'invalid-url' });

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', 'URL is not valid (must include http:// or https://)');
    });

    test('POST /shorten - should reject a URL that is too short', async () => {
        const response = await request(app)
            .post('/shorten')
            .send({ originalUrl: 'http://a.co' });

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', 'URL is too short to be shortened');
    });

    test('GET /:shortened_id - should redirect to the original URL', async () => {
        // First, create a short URL
        const shortenResponse = await request(app)
            .post('/shorten')
            .send({ originalUrl: 'https://example.com' });

        const shortUrl = shortenResponse.body.shortUrl.split('/').pop(); 

        const redirectResponse = await request(app).get(`/${shortUrl}`);
        expect(redirectResponse.statusCode).toBe(302); 
        expect(redirectResponse.headers.location).toBe('https://example.com');
    });

    test('GET /:shortened_id - should return 404 for a non-existent short URL', async () => {
        const response = await request(app).get('/nonexistent');
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('error', 'URL not found');
    });

    test('GET /:shortened_id - should return 400 for an expired URL', async () => {
        const expiredUrl = new Url({
            originalUrl: 'https://example.com',
            shortUrl: 'expired',
            expiredAt: new Date(Date.now() - 1000),
        });
        await expiredUrl.save();

        const response = await request(app).get('/expired');
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', 'URL has expired');
    });
});