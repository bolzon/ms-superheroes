
const router = require('express').Router();

module.exports = app => {

	router.use(app.auth.authenticate());

	// list users
	// create user
	// update user
	// delete user
	// get single user

	router.all('/', async (req, res) => {
		res.json({ loggedUser: req.user });
	});

	app.use('/users', router);
	return router;
};
