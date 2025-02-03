import express from 'express';
import { nanoid } from 'nanoid'
import Url from '../models/Url.js';
const router = express.Router();

router.post('/shorten', async (req, res) => {
    const { originalUrl } = req.body;
    //test if the url is null
    if (!originalUrl) return res.status(400).json({ error: 'insert URL' });

    //test if the url is valid
    if (!originalUrl.includes('http://') && !originalUrl.includes('https://')) {
        return res.status(400).json({ error: 'URL is not valid (must include http:// or https://)' });
    }

    //test if the url is too short
    if (originalUrl.length <= ('http://localhost:5000/').length + 6) {
        return res.status(400).json({ error: 'URL is too short to be shortened' });
    }

    //test if the url is already in the database
    const url = await Url.findOne({ originalUrl: originalUrl });
    if (url) return res.json({ shortUrl: `http://localhost:5000/${url.shortUrl}`, originalUrl: url.originalUrl });

    const shortUrl = nanoid(6);
    const createdAt = new Date();
    
    // Default to 3 days if not provided
    const expiredAt = req.body.expiredAt ? new Date(req.body.expiredAt) : new Date(createdAt.getTime() + 3 * 24 * 60 * 60 * 1000); 

    const newUrl = new Url({ originalUrl, shortUrl, expiredAt });
    await newUrl.save();
    res.json({ shortUrl: `http://localhost:5000/${shortUrl}`, originalUrl });
});

router.get('/:shortened_id', async (req, res) => {
    const url = await Url.findOne({ shortUrl: req.params.shortened_id });
    if (!url) return res.status(404).json({ error: 'URL not found' });
    if (url.expiredAt && new Date(url.expiredAt) < new Date()) {
        return res.status(400).json({ error: 'URL has expired' });
    }

    url.clicks += 1;
    await url.save();
    res.redirect(url.originalUrl);
});

export default router;
