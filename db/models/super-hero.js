
module.exports = (sequelize, DataType) => {

	const SuperHero = sequelize.define('SuperHeroes', {
		id: {
			type: DataType.INTEGER.UNSIGNED,
			primaryKey: true,
			autoIncrement: true
		}
	});
/*
	SuperHero.associate = models => {
		SuperHero.hasMany(models.SuperPower, {
			onDelete: 'CASCADE'
		});
	};
*/
	return SuperHero;
}
