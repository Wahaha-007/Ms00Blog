import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

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

app.post('/events', (req, res) => {
  const { type, data } = req.body;

  if (type === 'PostCreated') {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] }; // Clever to also init array here :)
  }

  if (type === 'CommentCreated') {
    const { id, content, postId } = data;

    const post = posts[postId]; // both references refer to the same object !
    post.comments.push({ id, content });
  }

  console.log(posts);
  res.send({});
});

app.listen(4002, () => {
  console.log('Listening on 4002');
});
