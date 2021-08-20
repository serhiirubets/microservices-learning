const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events', (req, res) => {
  const event = req.body;
  
  axios.post('http://localhost:7000/events', event);
  axios.post('http://localhost:7001/events', event);
  axios.post('http://localhost:7002/events', event);
  
  res.send({ status: 'OK' });
});

app.listen(7005, () => {
  console.log('Listening on 7005');
});