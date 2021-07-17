const axios = require('axios');
const convertXml2Json = require('xml-js');

const express = require('express');
const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  const result = await axios.get('https://www.nasa.gov/rss/dyn/Houston-We-Have-a-Podcast.rss');


  const { rss: { channel } } = convertXml2Json.xml2js(result.data, { compact: true, spaces: 4 });
  
  console.log(channel);

  res.json(channel);
});

app.get('/sort', (req, res) => {
  console.log(req.query.order);
  res.json('sorted order!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});