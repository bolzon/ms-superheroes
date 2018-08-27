
const router = require('express').Router();
const authorization = require('../lib/helpers/authorization');

module.exports = app => {

	const usersCtrl = app.controllers['users'];

	router.use(app.auth.authenticate());
	router.use(authorization.forAdminRole());

	router.get('/', usersCtrl.getAll);
	router.get('/:username', usersCtrl.getSingle);
	router.post('/', usersCtrl.create);
	router.put('/', usersCtrl.update);
	router.delete('/:username', usersCtrl.delete);

	app.use('/users', router);
	return router;
};
