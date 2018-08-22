
module.exports = (sequelize, DataType) => {

	const SuperPower = sequelize.define('SuperPowers', {
		id: {
			type: DataType.INTEGER.UNSIGNED,
			primaryKey: true,
			autoIncrement: true
		}
	});

	return SuperPower;
}
