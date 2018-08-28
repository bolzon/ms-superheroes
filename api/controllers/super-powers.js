
const HttpStatus = require('../lib/helpers/http').status;

module.exports = app => {

	const SuperPower = app.db.models.SuperPower;

	/** Super Powers controller class. */
	class SuperPowersController {

		/**
		 * Gets all super powers as paginated list.
		 * @param {Number} req.query.page Page for pagination.
		 * @param {Number} req.query.per_page Items per page for pagination.
		 */
		static async getAll(req, res) {
			const { offset, limit } = req.query;
			try {
				const results = await SuperPower.findAndCountAll({
					order: [ 'name' ],
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
		 * Gets a single super power by id.
		 * @param {String} req.params.id Super power id.
		 */
		static async getSingle(req, res) {
			const { id } = req.params;
			try {
				const superPower = await SuperPower.findOne({ where: { id } });
				superPower ? res.json(superPower) : res.sendNotFound();
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
		 * Deletes a single super power by id.
		 * @param {String} req.params.id Super power id.
		 */
		static async delete(req, res) {
			const { id } = req.params;
			if (!id) {
				return res.sendBadRequest('Missing "id"');
			}

			try {
				let superPower = await SuperPower.findOne({ where: { id } });
				if (superPower) {
					await superPower.destroy();
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

	return SuperPowersController;
};
