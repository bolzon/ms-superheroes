
const socket = require('socket.io');

module.exports = app => {
	return {
		start: async (server) => {
			app.io = socket(server);
		},
		emit: async message => {
			app.io.emit('auditEvent', message);
		}
	};
};
