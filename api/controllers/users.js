
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
			if (!username)
				return res.sendNotFound();

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

		static async create(req, res) {
			res.status(HttpStatus.NotImplemented).end();
		}

		static async update(req, res) {
			res.status(HttpStatus.NotImplemented).end();
		}

		/**
		 * Deletes a single user by username.
		 * @param {String} req.params.username Username.
		 */
		static async delete(req, res) {
			const { username } = req.params;
			if (!username)
				return res.sendNotFound();

			try {
				let user = await User.findOne({ where: { username } });
				if (user) {
					user.destroy();
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
