const pool = require('../configs/db.js');
const logger = require('../helpers/logger.js');
const loggerStatus = require('../helpers/loggingStatus.js');

const signUp = (res, statusCode, headerName, HeaderValue, log, jsonResponse , loggerStatus) => {
    res.statusCode = statusCode;
    res.setHeader(headerName, HeaderValue);
    logger(log, loggerStatus);
    res.end(JSON.stringify(jsonResponse));
};




module.exports = signUp;