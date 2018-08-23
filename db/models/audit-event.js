
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
			type: DataType.INTEGER.UNSIGNED,
			allowNull: false
		},
		datetime: {
			type: DataType.DATE,
			allowNull: false
		},
		username: {
			type: DataType.STRING,
			allowNull: false
		},
		action: {
			type: DataType.STRING
		}
	});

	return AuditEvent;
}
