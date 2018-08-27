
const router = require('express').Router();
const authorization = require('../lib/helpers/authorization');

module.exports = app => {

	const superPowersCtrl = app.controllers['super-powers'];

	router.use(app.auth.authenticate());

	router.get('/', superPowersCtrl.getAll);
	router.get('/:id', superPowersCtrl.getSingle);

	router.use(authorization.forAdminRole());

	router.post('/', superPowersCtrl.create);
	router.put('/', superPowersCtrl.update);
	router.delete('/:id', superPowersCtrl.delete);

	app.use('/super-powers', router);
	return router;
};
