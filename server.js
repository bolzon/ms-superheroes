
const consign = require('consign');
const app = require('express')();

consign({ verbose: false, cwd: 'api' })
	.include('config.json')
	.then('db.js')
	.then('auth.js')
	.then('middlewares.js')
	.then('controllers')
	.then('routes')
	.then('logger.js')
	.then('init.js')
	.then('push.js')
	.into(app);

module.exports = app;
