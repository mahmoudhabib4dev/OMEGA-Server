const pool = require('../configs/db.js');
const errorHandler = require('./errorController.js');
const successHandler = require('./successController.js');
const {
    RECORDS_NOT_FOUND,
    DATA_GOT_SUCCESSFULLY,
    SERVER_ERROR,
    MISSING_ID,
    USER_NOT_FOUND,
    YOU_ARE_NOT_AUTHORIZED,
    RECORD_CREATED_SUCCESSFULLY,
    RECORD_WAS_NOT_CREATED,
    RECORD_DELETED_SUCCESSFULLY,
    RECORD_UPDATED_SUCCESSFULLY,
    UPDATE_RECORD_FAILED
} = require('../configs/messages.js');

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
const deleteAboutUs = async (req, res) => {
    const reqBody = await requestBodyParser(req);
    let client;
    try {
        client = await pool.connect();
        const {
            id,
            about_us_post_id
        } = reqBody;
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
        if (role !== 'admin' && role !== 'super_admin') {
            return errorHandler(res, 403, YOU_ARE_NOT_AUTHORIZED, {
                success: false,
                message: YOU_ARE_NOT_AUTHORIZED
            });
        }

        const recordExists = await client.query(`SELECT created_at FROM about_us WHERE id=$1`, [about_us_post_id]);
        if (recordExists.rowCount === 0) {
            return errorHandler(res, 404, RECORDS_NOT_FOUND, {
                success: false,
                message: RECORDS_NOT_FOUND
            });
        }

        await client.query(`DELETE FROM about_us WHERE id=$1`, [about_us_post_id]);

        return successHandler(res, 200, RECORD_DELETED_SUCCESSFULLY, {
            success: true,
            message: RECORD_DELETED_SUCCESSFULLY
        });

    } catch (error) {
        return errorHandler(res, 500, error.message, { success: false, message: SERVER_ERROR });
    } finally {
        if (client) client.release();
    }

};
const updateAboutUs = async (req, res) => {
    const reqBody = await requestBodyParser(req);
    let client;
    try {
        client = await pool.connect();
        const {
            id,
            about_us_post_id,
            title,
            content,
            image_url
        } = reqBody;
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
        if (role !== 'admin' && role !== 'super_admin') {
            return errorHandler(res, 403, YOU_ARE_NOT_AUTHORIZED, {
                success: false,
                message: YOU_ARE_NOT_AUTHORIZED
            });
        }
        const recordExists = await client.query(`SELECT created_at FROM about_us WHERE id=$1`, [about_us_post_id]);

        if (recordExists.rowCount === 0) {
            return errorHandler(res, 404, RECORDS_NOT_FOUND, {
                success: false,
                message: RECORDS_NOT_FOUND
            });
        }

        const updateRecordResult = await client.query(`
            UPDATE about_us SET
                title=COALESCE($1, title),
                content=COALESCE($2, content),
                image_url=COALESCE($3, image_url),
            WHERE id=$4`,
            [title ?? null, content ?? null, image_url ?? null,
            about_us_post_id ?? null]);


        if (updateRecordResult.rowCount === 0) {
            return errorHandler(res, 400, UPDATE_RECORD_FAILED, {
                success: false,
                message: UPDATE_RECORD_FAILED
            });
        }

        return successHandler(res, 200, RECORD_UPDATED_SUCCESSFULLY, {
            success: true,
            message: RECORD_UPDATED_SUCCESSFULLY
        });
    } catch (error) {
        return errorHandler(res, 500, error.message, { success: false, message: SERVER_ERROR });
    } finally {
        if (client) client.release();
    }
};
const createAboutUs = async (req, res) => {
    const reqBody = await requestBodyParser(req);
    let client;
    try {
        client = await pool.connect();
        const {
            id,
            title,
            content,
            image_url
        } = reqBody;
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
        if (role !== 'admin' && role !== 'super_admin') {
            return errorHandler(res, 403, YOU_ARE_NOT_AUTHORIZED, {
                success: false,
                message: YOU_ARE_NOT_AUTHORIZED
            });
        }

        const createAboutUsRecordResult = await client.query(`INSERT INTO about_us (title,
            content,
            image_url) VALUES ($1, $2, $3) RETURNING *`, [
            title,
            content,
            image_url
        ]);

        if (createAboutUsRecordResult.rowCount !== 1) {
            return errorHandler(res, 500, RECORD_WAS_NOT_CREATED, { success: false, message: SERVER_ERROR });
        }

        return successHandler(res, 201, RECORD_CREATED_SUCCESSFULLY, {
            success: true,
            message: RECORD_CREATED_SUCCESSFULLY,
            course: createAboutUsRecordResult.rows[0]
        });
    } catch (error) {
        return errorHandler(res, 500, error.message, { success: false, message: SERVER_ERROR });
    } finally {
        if (client) client.release();
    }
};



module.exports = { getAboutUs, deleteAboutUs, updateAboutUs, createAboutUs };