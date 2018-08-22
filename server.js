
const app = require('./app');
const db = require('./db')(app);

db.sequelize.sync().done(async () => {
	await app.listen(process.env.PORT || 3000);
	console.log(`Server up on port ${app.config.port}`);
});
