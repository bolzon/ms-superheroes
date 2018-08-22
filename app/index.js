
const fs = require('fs');
const helmet = require('helmet');
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();

app.config = JSON.parse(fs.readFileSync('./config.json'));

app.disable('x-powered-by');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(helmet());
app.use('/', routes);

module.exports = app;
