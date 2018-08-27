
const crypt = require('../lib/helpers/crypt');
const HttpStatus = require('../lib/helpers/http').status;

module.exports = app => {

	const ctrl = {};
	const User = app.db.models.User;

	/**
	 * Generates a new user token.
	 * @param {Request} req Request object.
	 * @param {Response} res Response object.
	 */
	ctrl.token = async (req, res) => {

		try {
			const { username, password } = req.body;

			if (!username || !password) {
				return res.sendError(HttpStatus.BadRequest, 'Username and password are required');
			}

			const user = await User.findOne({ where: { username } });

			if (user && await User.checkPassword(password, user.password)) {
				let jsonUser = user.toJSON();
				delete jsonUser.password;
				res.json({ token: await crypt.generateJWT(jsonUser) });
			}
			else {
				res.sendError(HttpStatus.Unauthorized, 'Invalid credentials');
			}
		}
		catch (ex) {
			console.log(ex);
			res.sendError(HttpStatus.InternalServerError, 'Unexpected error');
		}
	};

	return ctrl;
};
