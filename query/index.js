import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {}; // Here is the server, every Var is State var !

app.get('/posts', (req, res) => {
  res.send(posts);
});

/* Quick Example of final Object

posts = { 
  'j12233': {
    pid: 'j12233',
    title: 'Post Title',
    comments: [
      { cid: 'dfhdfhdf', content: 'Comment!'}, 
      {         },
      {         }
    ] 
  },
  'j12233': {
    pid: 'j12233',
    title: 'Post Title',
    comments: [
      { cid: 'dfhdfhdf', content: 'Comment!'}, 
      {         },
      {         }
    ] 
  }
}
*/

const handleEvent = (type, data) => {
  if (type === 'PostCreated') {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] }; // Clever to also init array here :)
  }

  if (type === 'CommentCreated') {
    const { id, content, postId, status } = data;

    const post = posts[postId]; // both references refer to the same object !
    post.comments.push({ id, content, status });
  }

  if (type == 'CommentUpdated') {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    const comment = post.comments.find((comment) => comment.id === id);

    comment.status = status;
    // And also update for future
    comment.content = content;
  }
};

app.post('/events', (req, res) => {
  const { type, data } = req.body;

  handleEvent(type, data);
  console.log(posts);
  res.send({});
});

app.listen(4002, async () => {
  console.log('Listening on 4002');

  // The below section is added just for testing (powerup update) purpose
  try {
    const res = await axios.get('http://event-bus-srv:4005/events');

    for (let event of res.data) {
      console.log('Processing event:', event.type);

      handleEvent(event.type, event.data);
    }
  } catch (error) {
    console.log(error.message);
  }
});
