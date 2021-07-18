const express = require('express');
const helmet = require('helmet');
const convertXml2Json = require('xml-js');

const nasaRssFeed = require('./services/nasaRssService');
const cacheService = require('./services/cacheService');

const app = express();
const port = 3000;

app.use(helmet());

app.use(async (_req, res, next) => {
  const channelName = 'Houston-We-Have-a-Podcast';
  const nacaCacheService = new cacheService('NASA_RSS_CHANNEL');

  const nasaChannelData = await nasaRssFeed.getData(channelName);

  // const nasaChannelData = nacaCacheService.getOrSetCache(async () => {
  //   return await nasaRssFeed.getData(channelName);
  // }, channelName);

  const { rss: { channel } } = convertXml2Json.xml2js(nasaChannelData, { compact: true, spaces: 4 });

  res.locals.nasaRssFeed = channel;
  next()
});

app.get('/', (_req, res) => {

  

  res.json(res.locals.nasaRssFeed);
});

app.get('/sort', (req, res) => {
  console.log(req.query.order);
  res.json('sorted order!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});