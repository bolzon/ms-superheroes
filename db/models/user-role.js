
module.exports = (sequelize, DataType) => {

	const UserRole = sequelize.define('UserRoles', {
		id: {
			type: DataType.INTEGER.UNSIGNED,
			primaryKey: true,
			autoIncrement: true
		}
	});

	return UserRole;
}
