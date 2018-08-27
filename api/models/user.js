
const crypt = require('../lib/helpers/crypt');

module.exports = (sequelize, DataType) => {

	const User = sequelize.define('User', {
		id: {
			type: DataType.INTEGER.UNSIGNED,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataType.STRING,
			allowNull: false
		},
		username: {
			type: DataType.STRING,
			allowNull: false,
			unique: true
		},
		password: {
			type: DataType.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
				len: [8, 12]
			}
		}
	}, { timestamps: false });

	User.hook('beforeCreate', async user => {
		user.password = await crypt.encodePassword(user.password);
	});

	User.checkPassword = async (plainPassword, encodedPassword) => {
		return await crypt.checkPassword(plainPassword, encodedPassword);
	};

	return User;
};
