const router = require('express').Router();

const fetchNasaRssData = require('../middleware/fetchNasaRssData');
const channelCtrl = require('../controllers/channelCtrl');

router.use(fetchNasaRssData);

router.get('/', channelCtrl.channelRootCtrl);
router.get('/sort', channelCtrl.channelOrderedEpisodesCtrl);

module.exports = router;