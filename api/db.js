
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

module.exports = app => {

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
					'afterFind',
					'afterCreate',
					'afterUpdate',
					'afterDelete'
				];

				pk = Array.isArray(pk) ? pk[0] : pk;

				hooks.forEach(hook => {
					model.hook(hook, async (result, opts) => {
						if (opts.hasOwnProperty('audit')) {
							const action = hook.replace(/after/i, '').toUpperCase();
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
