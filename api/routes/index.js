
const router = require('express').Router();

module.exports = app => {
	router.all('/', async (req, res) =>
		res.type('text').send('SUPER HEROES CATALOGUE').end());
	app.use('/', router);
	return router;
};
