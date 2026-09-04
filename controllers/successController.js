
const logger = require('../helpers/logger.js');
const loggerStatus = require('../helpers/loggingStatus.js');

const successHandler = (res, statusCode, log, jsonResponse) => {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json');
    logger(log, loggerStatus.SUCCESS);
    res.end(JSON.stringify(jsonResponse));
}


module.exports = successHandler;