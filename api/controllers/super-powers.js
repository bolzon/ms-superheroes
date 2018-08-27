
const HttpStatus = require('../lib/helpers/http').status;

module.exports = app => {

	const ctrl = {};
	const SuperPower = app.db.models.SuperPower;

	/**
	 * Gets all super powers as paginated list.
	 * @param {Request} req Request object.
	 * @param {Response} res Response object.
	 */
	ctrl.getAll = async (req, res) => {
		const { offset, limit } = req.query;
		try {
			const superHeroes = await SuperPower.findAll({
				order: [ 'name' ],
				offset,
				limit
			});
			res.json(superHeroes);
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
