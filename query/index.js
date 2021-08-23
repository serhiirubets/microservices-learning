const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const posts = {}

const handleEvent = (type, data) => {
  if (type === 'PostCreated') {
    const { id, title } = data;

    posts[id] = { id, title, comments: [] }
  }

  if (type === 'CommentCreated') {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if (type === 'CommentUpdated') {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    const comment = post.comments.find(comment => comment.id === id);

    comment.status = status;
    comment.content = content;
  }
}

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  const {type, data} = req.body;
  handleEvent(type, data);
  
  res.send({});
});

app.listen(7002, async () => {
  console.log('Listening on 7002');
  
  const res = await axios.get('http://localhost:7005/events');
  
  // If connection for some reason is down, after start, we get all events from event-bus and run
  // all events that event bus stores
  for (let event of res.data) {
    handleEvent(event.type, event.data);
  }
});