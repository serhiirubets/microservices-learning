const express = require('express');
const { randomBytes } = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require("axios");
const app = express();

const commentsByPostId = {};

app.use(cors());
app.use(bodyParser.json());

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
})

app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;
  const comments = commentsByPostId[req.params.id] || [];
  const newComment = { id: commentId, content, status: 'pending' };

  comments.push(newComment);
  commentsByPostId[req.params.id] = comments;

  await axios.post('http://localhost:7005/events', {
    type: 'CommentCreated',
    data: {
      ...newComment,
      postId: req.params.id
    }
  });
  
  res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
  const { type, data } = req.body;
  
  if (type === 'CommentModerated') {
    const { postId, id, status, content  } = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find(comment => comment.id === id);
    comment.status = status;
    
    await axios.post('http://localhost:7005/events', {
      type: 'CommentUpdated',
      data: {
        id, postId, status, content,
      } 
  })
  }
  res.send({});
});

app.listen(7001, () => {
  console.log('Listened on port 7001');
});