
module.exports = (sequelize, DataType) => {

	const ProtectionArea = sequelize.define('ProtectionArea', {
		id: {
			type: DataType.INTEGER.UNSIGNED,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataType.STRING,
			allowNull: false,
			unique: true
		},
		lat: {
			type: DataType.FLOAT
		},
		long: {
			type: DataType.FLOAT
		},
		radius: {
			type: DataType.INTEGER
		}
	}, { timestamps: false });

	return ProtectionArea;
}
