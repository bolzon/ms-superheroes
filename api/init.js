
module.exports = app => {

	app.use((req, res, next) => {
		res.sendNotFound();
	});

	app.start = () => new Promise((resolve, reject) => {
		app.db.sequelize.sync().done(async () => {
			await app.listen(app.config.port || 3000, err => {
				if (err) {
					reject(err);
				}
				else {
					console.log(`Server up on port ${app.config.port}.`);
					resolve();
				}
			});
		});
	});

	app.stop = () => new Promise(resolve => {
		console.log('Server stopped');
		resolve();
	});
};
