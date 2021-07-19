const express = require('express');
const helmet = require('helmet');

const convertXml2Json = require('xml-js');
const moment = require('moment-timezone');
const { convertISODateToAEST } = require('./utilities/format-iso-date-to-AEST');

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

  const { title: { _text: title } , item: items, description: { _text: description } } = res.locals.nasaRssFeed;

  const firstTenItems = items.filter((_item, idx) => idx <= 9);

  const episodes = firstTenItems.map(item => {

    return {
      title: item.title._text,
      audioUrl: item.enclosure._attributes.url,
      publishedDate: moment((item.pubDate._text)).format('DD/MM/YYYY, h:mm:ss a ZZ')
    }
  });

  const result = {
    title,
    description,
    episodes
  };

  res.json(result);
});

app.get('/sort', (req, res) => {
  console.log(req.query.order);
  res.json('sorted order!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

// console.log(moment('Fri, 16 Jul 2021 09:31 EDT').format('LLL').toString().toLowerCase());
// // console.log(moment('Fri, 02 Jul 2021 11:04 EDT').format('LLL').toString().toLowerCase());
const aestTime = moment.tz('Fri, 16 Jul 2021 09:31 EDT', 'Australia/Sydney').format('DD/MM/YYYY, h:mm:ss a') + ' AEST';
const timeObj1 = new Date('Fri, 16 Jul 2021 09:31 EDT');
const timeObj2 = new Date('Sat, 17 Jul 2021 09:31 EDT');
console.log({ aestTime, asc: timeObj1 < timeObj2 });
console.log(convertISODateToAEST('Fri, 16 Jul 2021 09:31 EDT'));
console.log({ timeObj2 })