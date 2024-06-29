const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const $ = require('jquery')


const app = express()
const port = 8000;

const url = 'https://en.wikipedia.org/wiki/List_of_S%26P_500_companies#S&P_500_component_stocks';

const companies = [];


async function scrape(){
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        const companies = [];
        const tickers = [];
        const list = [];


        $('#constituents tbody tr').each((index, element) => {
            const company = $(element).find('td:nth-child(2)').text().trim();
            const ticker = $(element).find('td:nth-child(1)').text().trim()
            tickers.push(ticker);
            companies.push(company);
        });

        for (let i = 0; i < tickers.length; i++) {
            list.push(`${tickers[i]}: ${companies[i]}`);
            console.log(list);
        }


        return list

    }catch (e) {
        console.log('Error fetching or parsing data', e);
        throw e;
    }
};


app.get('/sp500-stocks', async (req, res) => {
    try {
        const companies = await scrape();
        res.json({ company: companies});
    }catch (e) {
        res.status(500).send('An error occurred');
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// Example usage:
scrape().then((result) => {
    console.log('Scraped data:', result);
}).catch((error) => {
    console.error('Error in scraping:', error);
});

