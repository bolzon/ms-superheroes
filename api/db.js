
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

module.exports = app => {

	if (process.env.DB_TEST === 'true') {
		app.config.db.params.dialect = 'sqlite';
		app.config.db.params.storage = ':memory:';
		app.logger.info('Using sqlite/test database');
	}

	const sequelize = new Sequelize(
		app.config.db.database,
		app.config.db.username,
		app.config.db.password,
		app.config.db.params
	);

	const db = {
		sequelize,
		Sequelize,
		models: {}
	};

	const dir = path.join(__dirname, 'models');

	fs.readdirSync(dir).forEach(file => {
		const modelDir = path.join(dir, file);
		const model = sequelize.import(modelDir);
		db.models[model.name] = model;
	});

	Object.keys(db.models).forEach(key => {
		const model = db.models[key];
		if (!/audit/i.test(key)) {
			((entityName, pk) => {

				const hooks = [
					'Create',
					'Update',
					'Delete'
				];

				pk = Array.isArray(pk) ? pk[0] : pk;

				hooks.forEach(hook => {
					model.hook(`after${hook}`, async (result, opts) => {
						if (opts && opts.hasOwnProperty('audit')) {
							const action = hook.replace(/(before|after)/i, '').toUpperCase();
							opts.audit.log(entityName, Array.isArray(result) ? '<array>' : result[pk], action);
						}
					});
				});

			})(key, model.primaryKeyAttributes);
		}
		if (model.hasOwnProperty('associate')) {
			model.associate(db.models);
		}
	});

	return db;
};
