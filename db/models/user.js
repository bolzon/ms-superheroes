
module.exports = (sequelize, DataType) => {

	const User = sequelize.define('Users', {
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
			allowNull: false
		},
		password: {
			type: DataType.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
				len: [8, 12]
			}
		}
	});

	User.hook('beforeCreate', user => {
		//const salt = bcrypt.genSaltSync();
		//user.password = bcrypt.hashSync(user.password, salt);
	});

	User.checkPassword = (encodedPassword, password) => {
		return bcrypt.compareSync(password, encodedPassword);
	};

	return User;
};
