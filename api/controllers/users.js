
const HttpStatus = require('../lib/helpers/http').status;

module.exports = app => {

	const ctrl = {};
	const User = app.db.models.User;

	/**
	 * Gets all users as paginated list.
	 * @param {Request} req Request object.
	 * @param {Response} res Response object.
	 */
	ctrl.getAll = async (req, res) => {
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
	};

	ctrl.getSingle = async (req, res) => {
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
	};

	ctrl.create = async (req, res) => {
		res.status(HttpStatus.NotImplemented).end();
	};

	ctrl.update = async (req, res) => {
		res.status(HttpStatus.NotImplemented).end();
	};

	ctrl.delete = async (req, res) => {
		res.status(HttpStatus.NotImplemented).end();
	};

	return ctrl;
};
