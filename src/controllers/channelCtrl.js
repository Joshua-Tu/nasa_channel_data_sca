const channelContentFinder = require('../utilities/find-channel-content');

function channelRootCtrl(_req, res) {
  try {
    const dataWithEDT = channelContentFinder.findFirstNEpisodes(res.locals.nasaRssFeed);

    const dataWithAEST = channelContentFinder.findEdtEpisodes(dataWithEDT);
  
    res.json(dataWithAEST);
  } catch (error) {
    res.status(500).send('Internal server error');
  }
}

function channelOrderedEpisodesCtrl(req, res) {
  try {
    const dataWithEDT = channelContentFinder.findFirstNEpisodes(res.locals.nasaRssFeed);

    const orderedDataWithEDT = channelContentFinder.findOrderedEpisodes(dataWithEDT, req.query.order);
  
    const dataWithAEST = channelContentFinder.findEdtEpisodes(orderedDataWithEDT);
  
    res.json(dataWithAEST);
  } catch (error) {
    res.status(500).send('Internal server error');
  }
}

module.exports = {
  channelRootCtrl,
  channelOrderedEpisodesCtrl
}