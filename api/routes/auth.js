
const router = require('express').Router();

module.exports = app => {

	router.all('/', async (req, res) => {
		res.json({ status: 'ok', route: __filename });
	});

	return router;
};
