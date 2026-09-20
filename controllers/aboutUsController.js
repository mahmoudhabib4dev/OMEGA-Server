const pool = require('../configs/db.js');
const errorHandler = require('./errorController.js');
const successHandler = require('./successController.js');
const { RECORDS_NOT_FOUND, DATA_GOT_SUCCESSFULLY, SERVER_ERROR } = require('../configs/messages.js');

const getAboutUs = async (req, res) => {
   
    let client;
    try {

        client = await pool.connect();
        const getAboutUsResult = await client.query(`SELECT * FROM about_us`);

        if (getAboutUsResult.rowCount === 0) {
            return errorHandler(res, 400, RECORDS_NOT_FOUND, {
                success: false,
                message: RECORDS_NOT_FOUND
            });
        }
        return successHandler(res, 201, DATA_GOT_SUCCESSFULLY, {
            success: true,
            message: DATA_GOT_SUCCESSFULLY,
            aboutUs: getAboutUsResult.rows
        });

    } catch (error) {
        return errorHandler(res, 500, error.message, { success: false, message: SERVER_ERROR });
    } finally {
        if (client) client.release();
    }
};



module.exports = {getAboutUs};