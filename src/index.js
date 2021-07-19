require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const app = express();
const channelRouter = require('./router/channelRouter');
const fetchNasaRssData = require('./middleware/fetchNasaRssData');

const port = +process.env.PORT || 3000;

app.use(helmet());
app.use(fetchNasaRssData);

app.use('/', channelRouter);

app.all('*', (_req, res) => {
  res.status(404).send('Page not found');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});