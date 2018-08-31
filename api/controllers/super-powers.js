
const { Op } = require('sequelize');
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
			const results = await SuperPower.findAndCountAll({
				order: [ 'name' ],
				offset,
				limit,
				audit: req.audit
			});
			res.setTotalCount(results.count).json(results.rows);
		}

		/**
		 * Gets a single super power by id.
		 * @param {String} req.params.id Super power id.
		 */
		static async getSingle(req, res) {
			const { id } = req.params;
			const superPower = await SuperPower.findOne({
				where: { id },
				audit: req.audit
			});
			superPower ? res.json(superPower) : res.sendNotFound();
		}

		/**
		 * Creates a new super power.
		 * @param {Object} req.body  Super power object.
		 */
		static async create(req, res) {
			const superPower = req.body;
			try {
				const name = superPower['name'] || '';
				if (name && await SuperPowersController.isNameTaken(name)) {
					return res.sendError(HttpStatus.UnprocessableEntity, 'Super Power name is already taken');
				}

				let dbSuperPower = await SuperPower.create(superPower, {
					fields: [ 'name', 'description' ],
					audit: req.audit
				});

				res.json(dbSuperPower);
			}
			catch (ex) {
				app.logger.error(ex);
				res.sendUnexpectedError();
			}
		}

		/**
		 * Updates an existing super power.
		 * @param {Number} req.params.id Super power id.
		 * @param {Object} req.body Super power object.
		 */
		static async update(req, res) {
			const superPower = req.body;
			const { id } = req.params;
			try {
				let dbSuperPower = await SuperPower.findOne({ where: { id } });
				if (!dbSuperPower) {
					return res.sendNotFound();
				}

				const name = superPower['name'] || '';
				if (name && await SuperPowersController.isNameTaken(name, id)) {
					return res.sendError(HttpStatus.UnprocessableEntity, 'Super Power name is already taken');
				}

				await SuperPower.update(superPower, {
					where: { id },
					fields: [ 'name', 'description' ],
					audit: req.audit
				});

				dbSuperPower = await SuperPower.findOne({ where: { id } });
				res.json(dbSuperPower);
			}
			catch (ex) {
				app.logger.error(ex);
				res.sendUnexpectedError();
			}
		}

		/**
		 * Deletes a single super power by id.
		 * @param {String} req.params.id Super power id.
		 */
		static async delete(req, res) {
			const { id } = req.params;
			let superPower = await SuperPower.findOne({ where: { id } });
			if (superPower) {
				await superPower.destroy({ audit: req.audit });
				return res.ok();
			}
			res.sendNotFound();
		}

		/**
		 * Checks whether a super power name is already taken.
		 * @param {String} superPowerName Super Power name.
		 * @param {Number} id [Optional] Super Power id (when it's given, method
		 * also checks super power is different from that id).
		 * @returns {Boolean} `true` if so, `false` otherwise.
		 */
		static async isNameTaken(superPowerName, id) {
			const whereClause = {
				name: superPowerName
			};
			if (id) {
				whereClause.id = {
					[ Op.ne ]: id
				}
			}
			return await SuperPower.count({ where: whereClause }) > 0;
		}
	}

	return SuperPowersController;
};
