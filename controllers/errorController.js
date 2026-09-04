
const logger = require('../helpers/logger.js');
const loggerStatus = require('../helpers/loggingStatus.js');

const errorHandler = (res, statusCode, log, jsonResponse) => {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json');
    logger(log, loggerStatus.ERROR);
    res.end(JSON.stringify(jsonResponse));
}


module.exports = errorHandler;