
const router = require('express').Router();

module.exports = app => {

	const superPowersCtrl = app.controllers['super-powers'];

	router.use(app.auth.authenticate());

	// list superpowers
	// create superpower
	// update superpower
	// delete superpower
	// get single superpower

	router.all('/', async (req, res) => {
		res.json({ status: 'ok', route: __filename });
	});

	app.use('/super-powers', router);
	return router;
};
