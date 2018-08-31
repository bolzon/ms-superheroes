
const crypt = require('../lib/helpers/crypt');
const HttpStatus = require('../lib/helpers/http').status;

module.exports = app => {

	const User = app.db.models.User;

	/** Auth controller class. */
	class AuthController {

		/**
		 * Generates a new user token.
		 * @param {String} req.body.username Username to authenticate.
		 * @param {String} req.body.password User password to authenticate.
		 */
		static async token(req, res) {
			const { username, password } = req.body;
			if (!username || !password) {
				return res.sendBadRequest('Username and password are required');
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
	}

	return AuthController;
};
