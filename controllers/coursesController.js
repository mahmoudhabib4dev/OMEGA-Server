const pool = require('../configs/db.js');
const requestBodyParser = require('../helpers/requestBodyParser.js');
const errorHandler = require('./errorController.js');
const successHandler = require('../controllers/successController.js');
const uploadImage = require('./imageController.js');
const { REQUIRED_FIELDS_MESSING,
    MISSING_FIELDS, ROLE_ERROR,
    MISSING_ID,
    SERVER_ERROR,
    USER_NOT_FOUND,
    MISSING_COURSE_ID,
    YOU_ARE_NOT_AUTHORIZED,
    COURSE_WAS_NOT_CREATED,
    COURSE_CREATED_SUCCESSFULLY,
    YOU_ARE_NOT_THE_OWNER,
    COURSE_NOT_FOUND,
    COURSE_DELETED_SUCCESSFULLY } = require('../configs/messages.js');
const logger = require('../helpers/logger.js');

const createCourse = async (req, res) => {
    const reqBody = await requestBodyParser(req);
    let client;
    try {
        client = await pool.connect();
        const { id, teacher_id, title, description, cover_image_url } = reqBody;
        const user = await client.query(`SELECT * FROM users WHERE id=$1`, [id]);
        if (id === undefined) {
            return errorHandler(res, 400, MISSING_ID, {
                success: false,
                message: MISSING_ID
            });
        }
        if (user.rowCount === 0) {
            return errorHandler(res, 400, USER_NOT_FOUND, {
                success: false,
                message: USER_NOT_FOUND
            });
        }
        const userRole = await client.query(`SELECT name FROM roles where id=$1`, [user.rows[0].role_id]);
        const role = userRole.rows[0].name;
        if (role !== 'admin' && role !== 'teacher' && role !== 'super_admin') {
            return errorHandler(res, 403, YOU_ARE_NOT_AUTHORIZED, {
                success: false,
                message: YOU_ARE_NOT_AUTHORIZED
            });
        }
        const createCourseResult = await client.query(`INSERT INTO courses (created_by , teacher_id , title , description , cover_image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [
            id, teacher_id, title, description, cover_image_url
        ]);

        if (createCourseResult.rowCount !== 1) {
            return errorHandler(res, 500, COURSE_WAS_NOT_CREATED, { success: false, message: SERVER_ERROR });
        }

        return successHandler(res, 201, COURSE_CREATED_SUCCESSFULLY, {
            success: true,
            message: COURSE_CREATED_SUCCESSFULLY,
            course: createCourseResult.rows[0]
        });
    } catch (error) {
        return errorHandler(res, 500, error.message, { success: false, message: SERVER_ERROR });
    } finally {
        if (client) client.release();
    }
};




const deleteCourse = async (req, res) => {
    const reqBody = await requestBodyParser(req);
    let client;
    try {
        client = await pool.connect();
        const { id, user_id } = reqBody;
        if (id === undefined) {
            return errorHandler(res, 400, MISSING_COURSE_ID, {
                success: false,
                message: MISSING_COURSE_ID
            });
        }
        if (user_id === undefined) {
            return errorHandler(res, 400, MISSING_ID, {
                success: false,
                message: MISSING_ID
            });
        }

        const courseExists = await client.query(`SELECT created_by FROM courses WHERE id=$1`, [id]);

        if (courseExists.rowCount === 0) {
            return errorHandler(res, 404, COURSE_NOT_FOUND, {
                success: false,
                message: COURSE_NOT_FOUND
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
            if (String(courseExists.rows[0].created_by) !== String(user_id)) {
                return errorHandler(res, 403, YOU_ARE_NOT_THE_OWNER, {
                    success: false,
                    message: YOU_ARE_NOT_THE_OWNER
                });
            }
        }

        await client.query(`DELETE FROM courses WHERE id=$1`, [id]);

        return successHandler(res, 200, COURSE_DELETED_SUCCESSFULLY, {
            success: true,
            message: COURSE_DELETED_SUCCESSFULLY
        });
    } catch (error) {
        return errorHandler(res, 500, error.message, { success: false, message: SERVER_ERROR });
    } finally {
        if (client) client.release();
    }
};


module.exports = { createCourse, deleteCourse };