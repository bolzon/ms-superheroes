
/** Audit service class. */
class AuditService {

	constructor(auditModel, username, pushService) {
		this.auditModel = auditModel;
		this.username = username;
		this.pushService = pushService;
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

		await this.auditModel.create(auditEvent);
		await this.pushService.emit(auditEvent);
	}
}

module.exports = AuditService;
