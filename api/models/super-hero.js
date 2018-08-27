
module.exports = (sequelize, DataType) => {

	const SuperHero = sequelize.define('SuperHero', {
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
		alias: {
			type: DataType.STRING
		}
	}, { timestamps: false });

	SuperHero.associate = models => {
		SuperHero.hasMany(models.SuperPower, {
			as: 'superpowers',
			onDelete: 'CASCADE'
		});
	};

	return SuperHero;
}
