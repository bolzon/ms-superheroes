
const fs = require('fs');
const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');

module.exports = app => {

	const User = app.db.models.User;
	const secret = fs.readFileSync(app.config.auth.keyPath);

	const opts = {
		secretOrKey: secret,
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		algorithms: [ app.config.token.algorithm || 'ES512' ]
	};

	passport.use(new Strategy(opts, async (payload, done) => {
		try {
			console.log(payload);
			const user = await User.findById(payload.id);
			done(null, user ? { id: user.id } : null);
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
