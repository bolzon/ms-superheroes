
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

		static async create(req, res) {
			res.status(HttpStatus.NotImplemented).end();
		}

		static async update(req, res) {
			res.status(HttpStatus.NotImplemented).end();
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
	}

	return SuperHeroesController;
};
