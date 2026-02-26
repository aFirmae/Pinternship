const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

const eventsRouter = require('./routes/events');
const classesRouter = require('./routes/classes');
const contactRouter = require('./routes/contact');

// routers
app.use('/events', eventsRouter);
app.use('/classes', classesRouter);
app.use('/contact', contactRouter);

app.get('/', (req, res) => {
  res.send('Welcome to Greenfield Community Center!');
});

// Start the server
app.listen(port, () => {
  console.log(`Community Center server running at http://localhost:${port}`);
});
