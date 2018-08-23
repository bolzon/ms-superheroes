
module.exports = app => {

	app.all('/auth', async (req, res) => {
		res.json({ status: 'ok', route: __filename });
	});
};
