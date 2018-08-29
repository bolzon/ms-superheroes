
module.exports = app => {

	app.use((req, res, next) => {
		res.sendNotFound();
	});

	app.start = () => new Promise((resolve, reject) => {
		app.db.sequelize.sync().done(async () => {
			await app.listen(app.config.port || 3000, err => {
				err ? reject(err) : resolve();
			});
		});
	});
};
