
const router = require('express').Router();

module.exports = app => {

	router.get('/', async (req, res) => {
		res.type('text').send('SUPER HEROES CATALOGUE').end();
	});

	app.use('/', router);
	return router;
};
