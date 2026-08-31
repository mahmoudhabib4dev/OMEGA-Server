const pool = require('../configs/db.js');
const logger = require('../helpers/logger.js');
const loggerStatus = require('../helpers/loggingStatus.js');

const checkDBConnection = async () => {
    try {
        const testResult = await pool.query(`SELECT NOW()`);
        logger('DB connected successfully', loggerStatus.MESSAGE);
        return true;

    } catch (error) {
        logger(error.message, loggerStatus.ERROR);
        return false;
    }
};

module.exports = checkDBConnection;