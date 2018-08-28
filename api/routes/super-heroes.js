
const router = require('express').Router();
const authorization = require('../lib/helpers/authorization');

module.exports = app => {

	const superHeroesCtrl = app.controllers['super-heroes'];

	router.use(app.auth.authenticate());

	router.get('/', superHeroesCtrl.getAll);
	router.get('/:id', superHeroesCtrl.getSingle);

	router.use(authorization.forAdminRole());

	router.post('/', superHeroesCtrl.create);
	router.put('/:id', superHeroesCtrl.update);
	router.delete('/:id', superHeroesCtrl.delete);

	app.use('/super-heroes', router);
	return router;
};
