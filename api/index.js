
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const routes = require('./routes');

const app = express();

app.config = JSON.parse(fs.readFileSync('./config.json'));

app.disable('x-powered-by');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(helmet());

app.use(cors({
	methods: [ 'GET', 'POST', 'PUT', 'DELETE' ],
	allowedHeaders: [ 'Content-Type', 'Authorization' ]
}));

app.use(compression());
app.use(routes(app));

module.exports = app;
