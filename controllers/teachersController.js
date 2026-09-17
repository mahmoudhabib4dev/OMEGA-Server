const pool = require('../configs/db.js');
const bcrypt = require('bcryptjs');
const requestBodyParser = require('../helpers/requestBodyParser.js');
const errorHandler = require('./errorController.js');
const successHandler = require('../controllers/successController.js');
const {
    MISSING_TEACHER_ID,
    TEACHER_DELETED_SUCCESSFULLY,
    USER_NOT_FOUND,
    MISSING_ID,
    YOU_ARE_NOT_AUTHORIZED,
    YOU_ARE_NOT_THE_OWNER,
    SERVER_ERROR, 
    UPDATE_TEACHERS_FAILED,
    UPDATE_TEACHER_SUCCESSFULLY
} = require('../configs/messages.js');



const deleteTeacher = async (req, res) => {
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
            return errorHandler(res, 400, MISSING_TEACHER_ID, {
                success: false,
                message: MISSING_TEACHER_ID
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
        if (role !== 'admin' && role !== 'teacher' && role !== 'super_admin') {
            return errorHandler(res, 403, YOU_ARE_NOT_AUTHORIZED, {
                success: false,
                message: YOU_ARE_NOT_AUTHORIZED
            });
        }

        if (role === 'teacher') {
            if (id !== user_id) {
                return errorHandler(res, 403, YOU_ARE_NOT_THE_OWNER, {
                    success: false,
                    message: YOU_ARE_NOT_THE_OWNER
                });
            }
        }
        await client.query(`DELETE FROM users WHERE id=$1`, [user_id]);

        return successHandler(res, 200, TEACHER_DELETED_SUCCESSFULLY, {
            success: true,
            message: TEACHER_DELETED_SUCCESSFULLY
        });

    } catch (error) {
        return errorHandler(res, 500, error.message, { success: false, message: SERVER_ERROR });
    } finally {
        if (client) client.release();
    }
};


const updateTeacher = async (req, res) => {
    const reqBody = await requestBodyParser(req);
    let client;
    try {
        client = await pool.connect();
        const {
            id,
            user_id, full_name,
            phone,
            email,
            password,
            avatar_url,
            specialty,
            title,
            license_number,
            years_experience,
            workplace,
            bio,
            current_city } = reqBody;

        if (id === undefined) {
            return errorHandler(res, 400, MISSING_ID, {
                success: false,
                message: MISSING_ID
            });
        }

        if (user_id === undefined) {
            return errorHandler(res, 400, MISSING_TEACHER_ID, {
                success: false,
                message: MISSING_TEACHER_ID
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
        if (role !== 'admin' && role !== 'teacher' && role !== 'super_admin') {
            return errorHandler(res, 403, YOU_ARE_NOT_AUTHORIZED, {
                success: false,
                message: YOU_ARE_NOT_AUTHORIZED
            });
        }

        if (role === 'teacher') {
            if (id !== user_id) {
                return errorHandler(res, 403, YOU_ARE_NOT_THE_OWNER, {
                    success: false,
                    message: YOU_ARE_NOT_THE_OWNER
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

        const updateTeacherResult = await client.query(`
            UPDATE teachers SET
                specialty=COALESCE($1, specialty),
                title=COALESCE($2, title),
                license_number=COALESCE($3, license_number),
                years_experience=COALESCE($4, years_experience),
                workplace=COALESCE($5, workplace),
                bio=COALESCE($6, bio),
                current_city=COALESCE($7, current_city)
            WHERE user_id=$8`,
            [specialty ?? null, title ?? null, license_number ?? null,
                years_experience ?? null, workplace ?? null, bio ?? null,
                current_city ?? null, id]);

        if (updateUserResult.rowCount === 0 || updateTeacherResult.rowCount === 0) {
            await client.query('ROLLBACK');
            return errorHandler(res, 400, UPDATE_TEACHERS_FAILED, {
                success: false,
                message: UPDATE_TEACHERS_FAILED
            });
        }

        await client.query('COMMIT');

        return successHandler(res, 200, UPDATE_TEACHER_SUCCESSFULLY, {
            success: true,
            message: UPDATE_TEACHER_SUCCESSFULLY
        });

    } catch (error) {
        return errorHandler(res, 500, error.message, { success: false, message: SERVER_ERROR });
    } finally {
        if (client) client.release();
    }

};

module.exports = {
    deleteTeacher, updateTeacher
};