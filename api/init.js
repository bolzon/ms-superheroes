
module.exports = app => {

	app.start = () => new Promise((resolve, reject) => {
		app.db.sequelize.sync().done(async () => {
			const server = app.listen(app.config.port, err => {
				if (err) return reject(err);
				app.push.start(server).then(resolve).catch(reject); // starts push service
			});
		});
	});
};
