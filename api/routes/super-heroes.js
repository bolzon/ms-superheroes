
const router = require('express').Router();

module.exports = app => {

	const superHeroesCtrl = app.controllers['super-heroes'];

	router.use(app.auth.authenticate());

	router.get('/', superHeroesCtrl.getAll);
	router.get('/:id', superHeroesCtrl.getSingle);
	router.post('/', superHeroesCtrl.create);
	router.put('/', superHeroesCtrl.update);
	router.delete('/:id', superHeroesCtrl.delete);

	app.use('/super-heroes', router);
	return router;
};
