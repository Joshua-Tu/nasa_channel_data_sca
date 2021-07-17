const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/sort', (req, res) => {
  console.log(req.query.order);
  res.json('sorted order!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});