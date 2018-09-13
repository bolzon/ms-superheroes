
const winston = require('winston');

module.exports = app => {

    const isDevelopment = process.env.NODE_ENV === 'development';
    const transports = [ new winston.transports.File({ filename: 'errors.log', level: 'error' }) ];

    if (isDevelopment) {
        trnasports.push(new winston.transports.Console({ level: 'info' }));
    }

    const logger = winston.createLogger({
        level: isDevelopment ? 'info' : 'error',
        format: winston.format.simple(),
        timestamp: winston.format.timestamp(),
        transports
    });

    return {
        info: logger.info,
        error: logger.error
    };
};
