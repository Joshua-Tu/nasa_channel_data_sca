require('dotenv').config();
const cacheService = require('../services/cacheService');
const nacaCacheService = new cacheService(process.env.NASA_RSS_CHANNEL_CACHE_PREFIX);
const channelContentFinder = require('../utilities/find-channel-content');

async function channelRootCtrl(req, res) {
  try {
    const cacheKeyName = `ENDPOINT_PATH:${req.path}`;
    const responseCache = await nacaCacheService.get(cacheKeyName);
    if (responseCache) return res.json(JSON.parse(responseCache));

    const dataWithEDT = channelContentFinder.findFirstNEpisodes(res.locals.nasaRssFeed);

    const dataWithAEST = channelContentFinder.findEdtEpisodes(dataWithEDT);
  
    res.json(dataWithAEST);

    await nacaCacheService.set(cacheKeyName, JSON.stringify(dataWithAEST));
  } catch (error) {
    res.status(500).send('Internal server error');
  }
}

async function channelOrderedEpisodesCtrl(req, res) {
  try {
    const cacheKeyName = `ENDPOINT_URL:${req.url}`;
    const responseCache = await nacaCacheService.get(cacheKeyName);
    if (responseCache) return res.json(JSON.parse(responseCache));

    const dataWithEDT = channelContentFinder.findFirstNEpisodes(res.locals.nasaRssFeed);

    const orderedDataWithEDT = channelContentFinder.findOrderedEpisodes(dataWithEDT, req.query.order);
  
    const dataWithAEST = channelContentFinder.findEdtEpisodes(orderedDataWithEDT);
  
    res.json(dataWithAEST);
    
    await nacaCacheService.set(cacheKeyName, JSON.stringify(dataWithAEST)); 
  } catch (error) {
    res.status(500).send('Internal server error');
  }
}

module.exports = {
  channelRootCtrl,
  channelOrderedEpisodesCtrl
}