
const HttpStatus = require('../lib/helpers/http').status;

module.exports = app => {

	const User = app.db.models.User;

	/** Users controller class. */
	class UsersController {

		/**
		 * Gets all users as paginated list.
		 * @param {Number} req.query.page Page for pagination.
		 * @param {Number} req.query.per_page Items per page for pagination.
		 */
		static async getAll(req, res) {
			const { offset, limit } = req.query;
			const results = await User.findAndCountAll({
				order: [ 'name' ],
				attributes: {
					exclude: [ 'password' ]
				},
				offset,
				limit,
				audit: req.audit
			});
			res.setTotalCount(results.count).json(results.rows);
		}

		/**
		 * Gets a single user by username.
		 * @param {String} req.params.username Username.
		 */
		static async getSingle(req, res) {
			const { username } = req.params;
			const user = await User.findOne({
				where: { username },
				attributes: {
					exclude: [ 'password' ]
				},
				audit: req.audit
			});

			user ? res.json(user) : res.sendNotFound();
		}

		/**
		 * Creates a new user.
		 * @param {Object} req.body User object.
		 */
		static async create(req, res) {
			const user = req.body;
			try {
				let dbUser = await User.findOne({ where: { username: user.username } });
				if (dbUser) {
					return res.sendError(HttpStatus.UnprocessableEntity, 'Username already exists');
				}

				dbUser = await User.create(user, {
					fields: [ 'username', 'name', 'password', 'roleId' ],
					audit: req.audit
				});

				dbUser = dbUser.toJSON();
				delete dbUser.password;

				res.json(dbUser);
			}
			catch (ex) {
				app.logger.error(ex);
				res.sendUnexpectedError();
			}
		}

		/**
		 * Updates an existing user.
		 * @param {String} req.params.username Username.
		 * @param {Object} req.body User object.
		 */
		static async update(req, res) {
			const user = req.body;
			const { username } = req.params;
			try {
				let dbUser = await User.findOne({ where: { username } });
				if (!dbUser) {
					return res.sendNotFound();
				}

				await User.update(user, {
					where: { username },
					fields: [ 'name', 'password', 'roleId' ],
					audit: req.audit
				});

				dbUser = await User.findOne({ where: { username } });
				dbUser = dbUser.toJSON();

				delete dbUser.password;
				res.json(dbUser);
			}
			catch (ex) {
				app.logger.error(ex);
				res.sendUnexpectedError();
			}
		}

		/**
		 * Deletes a single user by username.
		 * @param {String} req.params.username Username.
		 */
		static async delete(req, res) {
			const { username } = req.params;
			let user = await User.findOne({ where: { username } });
			if (user) {
				await user.destroy({ audit: req.audit });
				return res.ok();
			}
			res.sendNotFound();
		}
	}

	return UsersController;
};
