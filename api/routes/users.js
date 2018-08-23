
const router = require('express').Router();
const usersCtrl = require('../controllers/users');

module.exports = app => {

	// list users
	// create user
	// update user
	// delete user
	// get single user

	router.all('/', async (req, res) => {
		res.json({ status: 'ok', route: __filename });
	});

	app.use('/users', router);
};
