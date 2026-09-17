const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../configs/db.js');
const requestBodyParser = require('../helpers/requestBodyParser.js');
const errorHandler = require('./errorController.js');
const successHandler = require('./successController.js');
const { MISSING_PASSWORD, MISSING_EMAIL, SERVER_ERROR, USER_NOT_FOUND , USER_NOT_ACTIVE } = require('../configs/messages.js');


const login = async (req, res) => {


    const reqBody = await requestBodyParser(req);
    let client;
    try {
        client = await pool.connect();
        const { email, password } = reqBody;

        if (email === undefined) {
            return errorHandler(res, 400, MISSING_EMAIL, {
                success: false,
                message: MISSING_EMAIL
            });
        }
        if (password === undefined) {
            return errorHandler(res, 400, MISSING_PASSWORD, {
                success: false,
                message: MISSING_PASSWORD
            });
        }

        const user = await client.query(`SELECT * FROM users WHERE email=$1`, [email]);
        if (user.rowCount === 0) {
            return errorHandler(res, 400, USER_NOT_FOUND, {
                success: false,
                message: USER_NOT_FOUND
            });
        }
        const isTeacher = await client.query(`SELECT is_active FROM teachers`);
        if(user.rows[0].is_active === false){
               return errorHandler(res, 400, USER_NOT_ACTIVE, {
                success: false,
                message: USER_NOT_ACTIVE
            });
        }
        successHandler(res, 200, 'login successfully', {
            success: true,
            message: 'login successfully',

        });

    } catch (error) {
        return errorHandler(res, 500, error.message, { success: false, message: SERVER_ERROR });
    } finally {
        if (client) client.release();
    }
};

module.exports = login;