const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../configs/db.js');
const requestBodyParser = require('../helpers/requestBodyParser.js');
const errorHandler = require('./errorController.js');
const successHandler = require('./successController.js');
const { MISSING_PASSWORD,
    MISSING_EMAIL,
    SERVER_ERROR,
    USER_NOT_FOUND,
    USER_NOT_ACTIVE,
    TEACHER_ACCOUNT_NOT_FOUND,
    TEACHER_ACCOUNT_NOT_APPROVED_YET,
    WRONG_PASSWORD
} = require('../configs/messages.js');


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

        const user = await client.query(
            `SELECT users.*, roles.name AS role_name
             FROM users
             INNER JOIN roles ON roles.id = users.role_id
             WHERE users.email = $1`,
            [email]
        );
        if (user.rowCount === 0) {
            return errorHandler(res, 400, USER_NOT_FOUND, {
                success: false,
                message: USER_NOT_FOUND
            });
        }


        if (user.rows[0].is_active === false) {
            return errorHandler(res, 400, USER_NOT_ACTIVE, {
                success: false,
                message: USER_NOT_ACTIVE
            });
        }



        const passwordMatches = await bcrypt.compare(
            password,
            user.rows[0].password_hash
        );

        if (!passwordMatches) {
            return errorHandler(res, 401, WRONG_PASSWORD, {
                success: false,
                message: WRONG_PASSWORD
            });
        }

        if (user.rows[0].role_name === 'teacher') {
            const teacher = await client.query(
                `SELECT approval_status
                 FROM teachers
                 WHERE user_id = $1`,
                [user.rows[0].id]
            );

            if (teacher.rowCount === 0) {
                return errorHandler(res, 403, TEACHER_ACCOUNT_NOT_FOUND, {
                    success: false,
                    message: TEACHER_ACCOUNT_NOT_FOUND
                });
            }

            if (teacher.rows[0].approval_status !== 'approved') {
                return errorHandler(res, 403, TEACHER_ACCOUNT_NOT_APPROVED_YET, {
                    success: false,
                    message: TEACHER_ACCOUNT_NOT_APPROVED_YET
                });
            }
        }


        const token = jwt.sign(
            {
                userId: user.rows[0].id,
                role: user.rows[0].role_name
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        );

        successHandler(res, 200, 'login successfully', {
            success: true,
            message: 'login successfully',
            token: token
        });

    } catch (error) {
        return errorHandler(res, 500, error.message, { success: false, message: SERVER_ERROR });
    } finally {
        if (client) client.release();
    }
};

module.exports = login;