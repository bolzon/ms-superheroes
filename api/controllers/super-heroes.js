
const HttpStatus = require('../lib/helpers/http').status;

module.exports = app => {

	const SuperHero = app.db.models.SuperHero;

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
					offset,
					limit
				});
				res.setTotalCount(results.count).json(results.rows);
			}
			catch (ex) {
				console.log(ex);
				res.sendUnexpectedError();
			}
		}

		/**
		 * Gets a single super hero by id.
		 * @param {String} req.params.id Super hero id.
		 */
		static async getSingle(req, res) {
			res.status(HttpStatus.NotImplemented).end();
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
			res.status(HttpStatus.NotImplemented).end();
		}
	}

	return SuperHeroesController;
};
