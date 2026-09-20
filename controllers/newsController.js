const pool = require('../configs/db.js');
const errorHandler = require('./errorController.js');
const successHandler = require('./successController.js');
const { RECORDS_NOT_FOUND, DATA_GOT_SUCCESSFULLY, SERVER_ERROR } = require('../configs/messages.js');

const getNews = async (req, res) => {
    let client;
    try {

        client = await pool.connect();
        const getNewsResult = await client.query(`SELECT * FROM news`);

        if (getNewsResult.rowCount === 0) {
            return errorHandler(res, 400, RECORDS_NOT_FOUND, {
                success: false,
                message: RECORDS_NOT_FOUND
            });
        }
        return successHandler(res, 201, DATA_GOT_SUCCESSFULLY, {
            success: true,
            message: DATA_GOT_SUCCESSFULLY,
            news: getNewsResult.rows
        });

    } catch (error) {
        return errorHandler(res, 500, error.message, { success: false, message: SERVER_ERROR });
    } finally {
        if (client) client.release();
    }
};



module.exports = {getNews};