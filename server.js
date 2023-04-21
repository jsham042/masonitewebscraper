const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/api/scrape', async (req, res) => {
    try {
        // Replace this URL with the actual URL of the page containing the Masonite door SKUs
        const url = 'https://www.homedepot.com/b/Doors-Windows-Interior-Doors/Masonite/N-5yc1vZc5ioZyq';

        const { data: html } = await axios.get(url);
        const $ = cheerio.load(html);

        // Replace the CSS selectors with the actual ones for the SKU and price elements on the page
        const skuSelector = '.some-sku-element';
        const priceSelector = '.some-price-element';

        const scrapedData = [];

        $(skuSelector).each((index, element) => {
            const sku = $(element).text();
            const price = parseFloat($(priceSelector).eq(index).text().replace(/[^0-9.]+/g, ''));

            scrapedData.push({ sku, price });
        });

        res.json(scrapedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while scraping the data.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
