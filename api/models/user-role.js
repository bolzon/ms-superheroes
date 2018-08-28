
module.exports = (sequelize, DataType) => {

	const UserRole = sequelize.define('UserRole', {
		name: {
			type: DataType.STRING,
			allowNull: false,
			primaryKey: true,
			unique: true
		},
		description: {
			type: DataType.STRING,
			allowNull: true
		}
	}, { timestamps: false });

	return UserRole;
}
