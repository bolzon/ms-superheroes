
/** Audit service class. */
class AuditService {

	constructor(auditModel, username) {
		this.auditModel = auditModel;
		this.username = username;
	}

	async log(entity, entityId, action) {
		const datetime = new Date();
		const auditEvent = {
			entity,
			entityId,
			datetime,
			action,
			username: this.username
		};

		this.auditModel.create(auditEvent);
	}
}

module.exports = AuditService;
