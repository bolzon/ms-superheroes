
module.exports = (sequelize, DataType) => {

	const ProtectionArea = sequelize.define('ProtectionAreas', {
		id: {
			type: DataType.INTEGER.UNSIGNED,
			primaryKey: true,
			autoIncrement: true
		}
	});

	return ProtectionArea;
}
