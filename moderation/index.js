import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
app.use(bodyParser.json());

app.post('/events', async (req, res) => {
  // 1. Receive Data
  const { type, data } = req.body;

  if (type === 'CommentCreated') {
    // 2. Decison logic HERE, can be longer
    const status = data.content.includes('orange') ? 'rejected' : 'approved';

    // 3. Send databack to the BUS
    await axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentModerated', // Imply receiver
      data: {
        id: data.id,
        postId: data.postId,
        status,
        content: data.content,
      },
    });
  }

  res.send({}); // 4. Just acknowledge very POSTs
});

app.listen(4003, () => {
  console.log('Listening on 4003');
});
