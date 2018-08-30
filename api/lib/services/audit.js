
/** Audit service class. */
class AuditService {

	/**
	 * Creates a new instance of AuditService class.
	 * @param {Object} auditModel Database model of the audited model.
	 * @param {String} username Username that triggered the action.
	 * @param {Object} pushService Reference to the push service.
	 */
	constructor(auditModel, username, pushService) {
		this.auditModel = auditModel;
		this.username = username;
		this.pushService = pushService;
	}

	/**
	 * Creates a new audit event on database and
	 * triggers it to clients connected to push service.
	 * @param {String} entity Entity name.
	 * @param {String} entityId Entity ID.
	 * @param {String} action Action.
	 */
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
