
module.exports = (sequelize, DataType) => {

	const AuditEvent = sequelize.define('AuditEvent', {
		id: {
			type: DataType.INTEGER.UNSIGNED,
			primaryKey: true,
			autoIncrement: true
		},
		entity: {
			type: DataType.STRING,
			allowNull: false
		},
		entityId: {
			type: DataType.STRING,
			allowNull: false
		},
		datetime: {
			type: DataType.DATE,
			allowNull: false
		},
		action: {
			type: DataType.STRING
		}
	}, { timestamps: false });

	AuditEvent.associate = models => {
		AuditEvent.belongsTo(models.User, {
			foreignKey: {
				name: 'username',
				allowNull: false
			}
		});
	};

	return AuditEvent;
}
