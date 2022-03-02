const express = require('express');
const logger = require('morgan');
const dotenv = require('dotenv');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

dotenv.config();

app.listen(process.env.PORT, () => {
    console.log(`Listening to server at port ${process.env.PORT}`);
})

module.exports = app;