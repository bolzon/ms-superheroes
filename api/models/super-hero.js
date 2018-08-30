
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
	}, {
		timestamps: false,
		tableName: 'SuperHeroes'
	});

	SuperHero.associate = models => {
		SuperHero.belongsToMany(models.SuperPower, {
			through: models.SuperHeroesPowers,
			foreignKey: {
				name: 'superHeroId',
				allowNull: false
			},
			as: 'superPowers'
		});

		SuperHero.belongsTo(models.ProtectionArea, {
			foreignKey: {
				name: 'protectionAreaId',
				allowNull: false
			}
		});
	};

	return SuperHero;
}
