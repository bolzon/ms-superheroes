
const fs = require('fs');
const path = require('path');
const router = require('express').Router();

module.exports = app => {

	router.get('/', async (req, res) => {
		res.type('text').send(`Server up on port ${req.app.config.port}`).end();
	});

	fs.readdirSync(__dirname).forEach(file => {
		const re = new RegExp(`${file}$`);
		if (!re.test(__filename)) {
			const route = require(path.join(__dirname, file));
			router.use(`/${file.replace(/\.\w+$/, '')}`, route(app));
		}
	});

	router.use(async (req, res, next) => {
		res.status(404).end();
	});

	return router;
};
