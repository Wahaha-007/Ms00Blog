import express from 'express';
import bodyParser from 'body-parser';
import { randomBytes } from 'crypto';
import cors from 'cors'; // PORT 4001
import axios from 'axios';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []); // return 'array' or 'empty array'
});

app.post('/posts/:id/comments', async (req, res) => {
  // 1. Format data and put into Whole Object { pid : [ {cid:cid, content:content},  ] }

  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;

  // If POST has no comment => Object not exist =>
  // commentsByPostId[req.params.id] returns undefine => init empty array
  const comments = commentsByPostId[req.params.id] || []; // 1.1 Read the present array

  comments.push({ id: commentId, content, status: 'pending' }); // 1.2 Update the array

  commentsByPostId[req.params.id] = comments; // 1.3 Update the Whole Object

  // 2. Here is the perfect place to also emit event
  await axios.post('http://localhost:4005/events', {
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      postId: req.params.id,
      status: 'pending',
    },
  });

  // 3. Tell the sender OK
  res.status(201).send(comments);
});

// 4 New additional section for moderation

app.post('/events', async (req, res) => {
  // 4.1 Get data
  const { type, data } = req.body;

  if (type === 'CommentModerated') {
    const { postId, id, status, content } = data;

    const comments = commentsByPostId[postId];

    const comment = comments.find((comment) => comment.id === id);
    comment.status = status;

    // 4.2 Emit data
    await axios.post('http://localhost:4005/events', {
      type: 'CommentUpdated',
      data: {
        id,
        status,
        postId,
        content,
      },
    });
  }

  res.send({});
});

app.listen(4001, () => {
  console.log('Listening on 4001');
});
