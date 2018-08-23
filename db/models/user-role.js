
module.exports = (sequelize, DataType) => {

	const UserRole = sequelize.define('UserRole', {
		id: {
			type: DataType.INTEGER.UNSIGNED,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataType.STRING,
			allowNull: false,
			unique: true
		}
	});

	return UserRole;
}
