const pool = require('../configs/db.js');
const bcrypt = require('bcryptjs');
const requestBodyParser = require('../helpers/requestBodyParser.js');
const errorHandler = require('./errorController.js');
const successHandler = require('../controllers/successController.js');
const {
    MISSING_STUDENT_ID,
    MISSING_ID,
    STUDENT_NOT_THE_OWNER,
    YOU_ARE_NOT_AUTHORIZED,
    STUDENT_DELETED_SUCCESSFULLY,
    UPDATE_STUDENT_SUCCESSFULLY,
    UPDATE_STUDENT_FAILED,
    SERVER_ERROR,
    USER_NOT_FOUND
} = require('../configs/messages.js');

const deleteStudent = async (req, res) => {
    const reqBody = await requestBodyParser(req);
    let client;
    try {
        client = await pool.connect();
        const { id, user_id } = reqBody;
        if (id === undefined) {
            return errorHandler(res, 400, MISSING_ID, {
                success: false,
                message: MISSING_ID
            });
        }
        if (user_id === undefined) {
            return errorHandler(res, 400, MISSING_STUDENT_ID, {
                success: false,
                message: MISSING_STUDENT_ID
            });
        }
        const userExsists = await client.query(`SELECT * FROM users WHERE id=$1`, [id]);
        if (userExsists.rowCount === 0) {
            return errorHandler(res, 400, USER_NOT_FOUND, {
                success: false,
                message: USER_NOT_FOUND
            });
        }

        const userRole = await client.query(`SELECT name FROM roles where id=$1`, [userExsists.rows[0].role_id]);
        const role = userRole.rows[0].name;
        if (role !== 'admin' && role !== 'student' && role !== 'super_admin') {
            return errorHandler(res, 403, YOU_ARE_NOT_AUTHORIZED, {
                success: false,
                message: YOU_ARE_NOT_AUTHORIZED
            });
        }

        if (role === 'student') {
            if (String(id) !== String(user_id)) {
                return errorHandler(res, 403, STUDENT_NOT_THE_OWNER, {
                    success: false,
                    message: STUDENT_NOT_THE_OWNER
                });
            }
        }
        await client.query(`DELETE FROM users WHERE id=$1`, [user_id]);

        return successHandler(res, 200, STUDENT_DELETED_SUCCESSFULLY, {
            success: true,
            message: STUDENT_DELETED_SUCCESSFULLY
        });

    } catch (error) {
        return errorHandler(res, 500, error.message, { success: false, message: SERVER_ERROR });
    } finally {
        if (client) client.release();
    }
};


const updateStudent = async (req, res) => {
    const reqBody = await requestBodyParser(req);
    let client;
    try {
        client = await pool.connect();
        const {
            id,
            user_id,
            full_name,
            phone,
            email,
            password,
            avatar_url,
            university,
            stage } = reqBody;

        if (id === undefined) {
            return errorHandler(res, 400, MISSING_ID, {
                success: false,
                message: MISSING_ID
            });
        }

        if (user_id === undefined) {
            return errorHandler(res, 400, MISSING_STUDENT_ID, {
                success: false,
                message: MISSING_STUDENT_ID
            });
        }

        const userExsists = await client.query(`SELECT * FROM users WHERE id=$1`, [user_id]);
        if (userExsists.rowCount === 0) {
            return errorHandler(res, 400, USER_NOT_FOUND, {
                success: false,
                message: USER_NOT_FOUND
            });
        }

        const userRole = await client.query(`SELECT name FROM roles where id=$1`, [userExsists.rows[0].role_id]);
        const role = userRole.rows[0].name;
        if (role !== 'admin' && role !== 'student' && role !== 'super_admin') {
            return errorHandler(res, 403, YOU_ARE_NOT_AUTHORIZED, {
                success: false,
                message: YOU_ARE_NOT_AUTHORIZED
            });
        }

        if (role === 'student') {
            if (String(id) !== String(user_id)) {
                return errorHandler(res, 403, STUDENT_NOT_THE_OWNER, {
                    success: false,
                    message: STUDENT_NOT_THE_OWNER
                });
            }
        }

        await client.query('BEGIN');

        const passwordHash = password === undefined
            ? null
            : await bcrypt.hash(password, 10);

        const updateUserResult = await client.query(`
            UPDATE users SET
                full_name=COALESCE($1, full_name),
                phone=COALESCE($2, phone),
                email=COALESCE($3, email),
                password_hash=COALESCE($4, password_hash),
                avatar_url=COALESCE($5, avatar_url)
            WHERE id=$6`,
            [full_name ?? null, phone ?? null, email ?? null,
                passwordHash, avatar_url ?? null, id]);

        const updateStudentResult = await client.query(`
            UPDATE students SET
                university=COALESCE($1, university),
                stage=COALESCE($2, stage)
            WHERE user_id=$3`,
            [university ?? null, stage ?? null, id]);

        if (updateUserResult.rowCount === 0 || updateStudentResult.rowCount === 0) {
            await client.query('ROLLBACK');
            return errorHandler(res, 400, UPDATE_STUDENT_FAILED, {
                success: false,
                message: UPDATE_STUDENT_FAILED
            });
        }

        await client.query('COMMIT');

        return successHandler(res, 200, UPDATE_STUDENT_SUCCESSFULLY, {
            success: true,
            message: UPDATE_STUDENT_SUCCESSFULLY
        });
    } catch (error) {
        return errorHandler(res, 500, error.message, { success: false, message: SERVER_ERROR });
    } finally {
        if (client) client.release();
    }
};

module.exports = {
    deleteStudent, updateStudent
};