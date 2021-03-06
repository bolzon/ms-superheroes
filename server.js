
const consign = require('consign');
const app = require('express')();

consign({ verbose: false, cwd: 'api' })
	.include('config.json')
	.then('logger.js')
	.then('db.js')
	.then('auth.js')
	.then('middlewares.js')
	.then('controllers')
	.then('routes')
	.then('init.js')
	.then('push.js')
	.into(app);

module.exports = app;
