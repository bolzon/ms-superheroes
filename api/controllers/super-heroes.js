
const { Op }  = require('sequelize');
const HttpStatus = require('../lib/helpers/http').status;

module.exports = app => {

	const SuperHero = app.db.models.SuperHero;
	const SuperPower = app.db.models.SuperPower;

	/** Super Heroes controller class. */
	class SuperHeroesController {

		/**
		 * Gets all super heroes as paginated list.
		 * @param {Number} req.query.page Page for pagination.
		 * @param {Number} req.query.per_page Items per page for pagination.
		 */
		static async getAll(req, res) {
			const { offset, limit } = req.query;
			try {
				const results = await SuperHero.findAndCountAll({
					order: [ 'name' ],
					include: [{ model: SuperPower }],
					offset,
					limit
				});
				res.setTotalCount(results.count).json(results.rows);
			}
			catch (ex) {
				console.error(ex);
				res.sendUnexpectedError();
			}
		}

		/**
		 * Gets a single super hero by id.
		 * @param {String} req.params.id Super hero id.
		 */
		static async getSingle(req, res) {
			const { id } = req.params;
			try {
				const superHero = await SuperHero.findOne({ where: { id } });
				superHero ? res.json(superHero) : res.sendNotFound();
			}
			catch (ex) {
				console.error(ex);
				res.sendUnexpectedError();
			}
		}

		/**
		 * Creates a new super hero.
		 * @param {Object} req.body Super hero object.
		 */
		static async create(req, res) {
			const superHero = req.body;
			try {
				const name = superHero['name'] || '';
				if (name && await SuperHeroesController.isNameTaken(name)) {
					return res.sendError(HttpStatus.UnprocessableEntity, 'Super Hero name is already taken');
				}

				let dbSuperHero = await SuperHero.create(superHero, {
					fields: [ 'name', 'alias' ]
				});

				res.json(dbSuperHero);
			}
			catch (ex) {
				console.error(ex);
				res.sendUnexpectedError();
			}
		}

		/**
		 * Updates an existing super hero.
		 * @param {Number} req.params.id Super hero id.
		 * @param {Object} req.body Super hero object.
		 */
		static async update(req, res) {
			const superHero = req.body;
			const { id } = req.params;
			try {
				let dbSuperHero = await SuperHero.findOne({ where: { id } });
				if (!dbSuperHero) {
					return res.sendNotFound();
				}

				const name = superHero['name'] || '';
				if (name && await SuperHeroesController.isNameTaken(name, id)) {
					return res.sendError(HttpStatus.UnprocessableEntity, 'Super Hero name is already taken');
				}

				await SuperHero.update(superHero, {
					where: { id },
					fields: [ 'name', 'alias' ]
				});

				dbSuperHero = await SuperHero.findOne({ where: { id } });
				res.json(dbSuperHero);
			}
			catch (ex) {
				console.error(ex);
				res.sendUnexpectedError();
			}
		}

		/**
		 * Deletes a single super hero by id.
		 * @param {String} req.params.id Super hero id.
		 */
		static async delete(req, res) {
			const { id } = req.params;
			try {
				let superHero = await SuperHero.findOne({ where: { id } });
				if (superHero) {
					await superHero.destroy();
					return res.ok();
				}
				res.sendNotFound();
			}
			catch (ex) {
				console.error(ex);
				res.sendUnexpectedError();
			}
		}

		/**
		 * Checks whether a super hero name is already taken.
		 * @param {String} superHeroName Super Hero name.
		 * @param {Number} id [Optional] Super Hero id (when it's given, method
		 * also checks super hero is different from that id).
		 * @returns {Boolean} `true` if so, `false` otherwise.
		 */
		static async isNameTaken(superHeroName, id) {
			const whereClause = {
				name: superHeroName
			};
			if (id) {
				whereClause.id = {
					[ Op.ne ]: id
				}
			}
			const count = await SuperHero.count({ where: whereClause });
			return count > 0;
		}
	}

	return SuperHeroesController;
};
