
const HttpStatus = require('../lib/helpers/http').status;

module.exports = app => {

	const ctrl = {};
	const SuperHero = app.db.models.SuperHero;

	/**
	 * Gets all super heroes as paginated list.
	 * @param {Request} req Request object.
	 * @param {Response} res Response object.
	 */
	ctrl.getAll = async (req, res) => {
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
	};

	ctrl.getSingle = async (req, res) => {
		res.status(HttpStatus.NotImplemented).end();
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
