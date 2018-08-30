
/** Audit service class. */
class AuditService {

	constructor(username) {
		this.username = username;
	}

	log(entityName, entityId, action) {
		console.log('auditing');
		console.log(entityName);
		console.log(entityId);
		console.log(action);
		console.log(this.username);
		console.log('\n\n');
	}
}

module.exports = AuditService;
