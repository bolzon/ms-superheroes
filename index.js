
const server = require('./server');
server.start().then(() => server.logger.info('Server is up'));
