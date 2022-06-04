import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express(); // This program is really like echo broadcaster !
app.use(bodyParser.json());

app.post('/events', (req, res) => {
  const event = req.body; // Can be any data type

  axios.post('http://localhost:4000/events', event).catch((err) => {
    console.log(err.message); // posts
  });
  axios.post('http://localhost:4001/events', event).catch((err) => {
    console.log(err.message); // comments
  });
  axios.post('http://localhost:4002/events', event).catch((err) => {
    console.log(err.message); // query
  });
  axios.post('http://localhost:4003/events', event).catch((err) => {
    console.log(err.message); // moderation
  });

  res.send({ status: 'OK' }); // Tell the  original event sender OK
});

app.listen(4005, () => {
  console.log('Listening on 4005');
});
