/**
 * Authorization module is used to authorize users to access specific routes by their roles.
 * @module lib/helpers/authorization
 */

/**
 * Authorizes an specific route to be accessed according to user role.
 * @param roles {Array} Array of role ids that are authorized to access a route.
 * @return {Object} Returns middleware to authorize the user to access or not a route.
 */
module.exports.forRoles = roles => async (req, res, next) => {

	if (!Array.isArray(roles)) {
		roles = [ roles ];
	}

	// this is kinda unnecessary due to the type of model we have to represent
	// user roles, but it's implemented anyway to demonstrate authorization

	const role = await req.app.db.models.UserRole.findOne({
		where: { name: req.user.roleId }
	});

	if (roles.includes(role.name)) {
		return next();
	}

	return res.sendForbidden();
};

/**
 * Authorizes an specific route to be accessed only by admin users.
 * @return {Object} Returns middleware to authorize only admins to access a route.
 */
module.exports.forAdminRole = () => {
	return module.exports.forRoles('Admin');
};
