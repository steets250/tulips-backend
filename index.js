const express = require('express');
const logger = require('morgan');
require('dotenv').config();
const apiRouter = require('./routes/index');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', apiRouter);

app.listen(process.env.PORT, () => {
    console.log(`Listening to server at port ${process.env.PORT}`);
})

module.exports = app;