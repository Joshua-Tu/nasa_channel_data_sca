const express = require('express');
const helmet = require('helmet');

const convertXml2Json = require('xml-js');

const channelContentFinder = require('./utilities/find-channel-content');

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
  try {
    const dataWithEDT = channelContentFinder.findFirstEpisodes(res.locals.nasaRssFeed);

    const dataWithAEST = channelContentFinder.findEdtEpisodes(dataWithEDT);
  
    res.json(dataWithAEST);
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

app.get('/sort', (req, res) => {
  const dataWithEDT = channelContentFinder.findFirstEpisodes(res.locals.nasaRssFeed);


  res.json('sorted order!');
});

app.all('*', (_req, res) => {
  res.status(404).send('Page not found');
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

const timeObj1 = new Date('Fri, 16 Jul 2021 09:31 EDT');
const timeObj2 = new Date('Sat, 17 Jul 2021 09:31 EDT');