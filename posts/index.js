import express from 'express';
import bodyParser from 'body-parser';
import { randomBytes } from 'crypto';
import cors from 'cors'; // PORT 4000
import axios from 'axios';

const app = express();

const posts = {};

app.use(bodyParser.json());
app.use(cors());

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/posts/create', async (req, res) => {
  // 1. Format data and put into Object { pid : { pid:pid, title:title}, ..... }
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = {
    id,
    title,
  };

  // 2. Here is the perfect place to also emit event
  await axios.post('http://event-bus-srv:4005/events', {
    type: 'PostCreated',
    data: { id, title },
  });

  // 3. Tell the sender OK
  res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
  console.log('Received Event', req.body.type);
  res.send({});
});

app.listen(4000, () => {
  console.log('v55');
  console.log('Listening on 4000');
});
