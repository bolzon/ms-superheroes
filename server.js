
const consign = require('consign');
const app = require('express')();

consign({ verbose: false, cwd: 'api' })
	.include('config.json')
	.then('db.js')
	.then('auth.js')
	.then('middlewares.js')
	.then('routes')
	.then('lib')
	.then('init.js')
	.into(app);
