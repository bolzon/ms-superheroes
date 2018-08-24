
const router = require('express').Router();

module.exports = app => {

	router.all('/', app.controllers.auth.token);

	app.use('/auth', router);
	return router;
};
