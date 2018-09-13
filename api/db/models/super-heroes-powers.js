
module.exports = (sequelize, DataType) => {

	const SuperHeroesPowers = sequelize.define('SuperHeroesPowers', {
		superHeroId: {
			type: DataType.INTEGER.UNSIGNED
		},
		superPowerId: {
			type: DataType.INTEGER.UNSIGNED
		}
	}, {
		tableName: 'SuperHeroesPowers'
	});

	return SuperHeroesPowers;
};
