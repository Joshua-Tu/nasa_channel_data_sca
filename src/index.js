const express = require('express');
const helmet = require('helmet');
const convertXml2Json = require('xml-js');

const nasaRssFeed = require('./services/nasaRssService');

const app = express();
const port = 3000;

app.use(helmet());

app.use(async (_req, res, next) => {
  const nasaChannelData = await nasaRssFeed.getData('Houston-We-Have-a-Podcast');
  const { rss: { channel } } = convertXml2Json.xml2js(nasaChannelData, { compact: true, spaces: 4 });

  res.locals.nasaRssFeed = channel;
  next()
});

app.get('/', (req, res) => {
  res.json(res.locals);
});

app.get('/sort', (req, res) => {
  console.log(req.query.order);
  res.json('sorted order!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});