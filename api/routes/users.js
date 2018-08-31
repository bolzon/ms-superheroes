
const router = require('express').Router();
const authorization = require('../lib/helpers/authorization');

module.exports = app => {

	const usersCtrl = app.controllers['users'];

	router.use(app.auth.authenticate());
	router.use(authorization.forAdminRole());

	router.get('/', usersCtrl.getAll);
	router.get('/:username([a-z0-9]+)', usersCtrl.getSingle);
	router.post('/', usersCtrl.create);
	router.put('/:username([a-z0-9]+)', usersCtrl.update);
	router.delete('/:username([a-z0-9]+)', usersCtrl.delete);

	app.use('/users', router);
	return router;
};
