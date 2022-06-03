import express from 'express';
import bodyParser from 'body-parser';
import { randomBytes } from 'crypto';
import cors from 'cors'; // PORT 4001

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;

  // If POST has no comment => Object not exist =>
  // commentsByPostId[req.params.id] returns undefine => init empty array
  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id: commentId, content }); // Array on comments

  commentsByPostId[req.params.id] = comments;

  res.status(201).send(comments);
});

app.listen(4001, () => {
  console.log('Listening on 4001');
});
