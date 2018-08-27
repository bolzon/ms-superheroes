
module.exports = (sequelize, DataType) => {

	const SuperPower = sequelize.define('SuperPower', {
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
		description: {
			type: DataType.STRING
		}
	}, { timestamps: false });

	SuperPower.associate = models => {
		SuperPower.belongsTo(models.SuperHero);
	};

	return SuperPower;
}
