
module.exports = app => {

	app.use((req, res, next) => {
		res.status(404).end();
	});

	app.db.sequelize.sync().done(async () => {
		await app.listen(process.env.PORT || 3000);
		console.log(`Server up on port ${app.config.port}.`);
	});
};
