
const fs = require('fs');
const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const AuditService = require('./lib/services/audit');

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
			done(null, user.toJSON());
		}
		catch (ex) {
			done(ex);
		}
	}));

	passport.serializeUser((user, done) => done(null, user));
	passport.deserializeUser((user, done) => done(null, user));

	const auth = {
		initialize: () => {
			return passport.initialize();
		},
		authenticate: () => (req, res, next) => {
			passport.authenticate('jwt', app.config.auth.jwtSession, (err, user, info) => {
				if (err) { return next(err); }
				if (!user) { return res.sendUnauthorized(); }
				req.login(user, errLogin => {
					if (errLogin) { return next(errLogin); }
					// injects audit service in request object
					const auditModel = req.app.db.models.AuditEvent;
					req.audit = new AuditService(auditModel, req.user.username, req.app.push);
					next();
				});
			})(req, res, next);
		}
	};

	return auth;
};
