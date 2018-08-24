
const router = require('express').Router();
const superHeroesCtrl = require('../controllers/super-heroes');

module.exports = app => {

	router.use(app.auth.authenticate());

	// list superheroes
	// create superhero
	// update superhero
	// delete superhero
	// get single superhero

	router.all('/', async (req, res) => {
		res.json({ status: 'ok', route: __filename });
	});

	app.use('/super-heroes', router);
};
