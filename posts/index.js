const express = require('express');
const { randomBytes } = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const axios = require('axios');

const posts = {};

app.use(cors());
app.use(bodyParser.json());

app.get('/posts', (req, res) => {
  res.send(posts);
})

app.post('/posts', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;
  
  posts[id] = { id, title };
  
  await axios.post('http://localhost:7005/events', {
    type: 'PostCreated',
    data: {
      id, title
    }
  });
  res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
  console.log('Received event', req.body);
  
  res.send({});
});

app.listen(7000, () => {
  console.log('Listened on port 7000');
});