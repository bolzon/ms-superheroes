
const winston = require('winston');

module.exports = app => {

    const logger = winston.createLogger({
        level: 'info',
        format: winston.format.simple(),
        timestamp: winston.format.timestamp(),
        transports: [
            new winston.transports.Console({ level: 'info' }),
            new winston.transports.File({ filename: 'errors.log', level: 'error' })
        ]
    });

    return {
        info: logger.info,
        error: logger.error
    };
};
