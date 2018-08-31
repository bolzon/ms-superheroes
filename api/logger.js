
const winston = require('winston');

module.exports = app => {

    const logger = winston.createLogger({
        level: 'error',
        timestamp: winston.format.timestamp(),
        format: winston.format.simple(),
        transports: [ new winston.transports.File({ filename: 'errors.log' }) ]
    });

    return {
        error: logger.error
    };
};