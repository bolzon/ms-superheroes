
const fs = require('fs');
const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');

module.exports = app => {

	const User = app.db.models.User;
	const secret = fs.readFileSync(app.config.auth.keyPath);

	const opts = {
		secretOrKey: secret,
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
	};

	passport.use(new Strategy(opts, async (payload, done) => {
		try {
			const user = await User.findOne({
				where: {
					username: payload.username
				},
				attributes: {
					exclude: [ 'password' ]
				}
			});
			done(null, user);
		}
		catch (ex) {
			done(ex);
		}
	}));

	const auth = {
		initialize: () => {
			return passport.initialize();
		},
		authenticate: () => {
			return passport.authenticate('jwt', app.config.auth.jwtSession);
		}
	};

	return auth;
};
