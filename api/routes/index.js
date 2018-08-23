
module.exports = app => {

	app.get('/', async (req, res) => {
		res.type('text').send('SUPER HEROES CATALOGUE').end();
	});
};
