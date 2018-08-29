
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
			try {
				const results = await User.findAndCountAll({
					order: [ 'name' ],
					attributes: {
						exclude: [ 'password' ]
					},
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
		 * Gets a single user by username.
		 * @param {String} req.params.username Username.
		 */
		static async getSingle(req, res) {
			const { username } = req.params;
			try {
				const user = await User.findOne({
					where: { username },
					attributes: {
						exclude: [ 'password' ]
					}
				});

				user ? res.json(user) : res.sendNotFound();
			}
			catch (ex) {
				console.error(ex);
				res.sendUnexpectedError();
			}
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
					fields: [ 'username', 'name', 'password', 'roleId' ]
				});

				dbUser = dbUser.toJSON();
				delete dbUser.password;

				res.json(dbUser);
			}
			catch (ex) {
				console.error(ex);
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
					fields: [ 'name', 'password', 'roleId' ]
				});

				dbUser = await User.findOne({ where: { username } });
				dbUser = dbUser.toJSON();

				delete dbUser.password;
				res.json(dbUser);
			}
			catch (ex) {
				console.error(ex);
				res.sendUnexpectedError();
			}
		}

		/**
		 * Deletes a single user by username.
		 * @param {String} req.params.username Username.
		 */
		static async delete(req, res) {
			const { username } = req.params;
			try {
				let user = await User.findOne({ where: { username } });
				if (user) {
					await user.destroy();
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

	return UsersController;
};
