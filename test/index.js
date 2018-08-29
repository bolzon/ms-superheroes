
global.server = require('../server');

before(() => {
	return global.server.start();
});
