
const crypt = require('../lib/helpers/crypt');

module.exports = (sequelize, DataType) => {

	const User = sequelize.define('User', {
		username: {
			type: DataType.STRING,
			allowNull: false,
			primaryKey: true,
			unique: true
		},
		name: {
			type: DataType.STRING,
			allowNull: false
		},
		password: {
			type: DataType.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
				len: [4, 12]
			}
		}
	}, { timestamps: false });

	User.hook('beforeCreate', async user => {
		user.password = await crypt.encodePassword(user.password);
	});

	User.hook('beforeUpdate', async user => {
		if (user.password) {
			user.password = await crypt.encodePassword(user.password);
		}
	});

	User.checkPassword = async (plainPassword, encodedPassword) => {
		return await crypt.checkPassword(plainPassword, encodedPassword);
	};

	User.associate = models => {
		User.belongsTo(models.UserRole, {
			foreignKey: {
				name: 'roleId',
				allowNull: false
			}
		});
	};

	return User;
};
