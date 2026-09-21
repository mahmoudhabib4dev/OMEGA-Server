const pool = require('../configs/db.js');
const errorHandler = require('./errorController.js');
const successHandler = require('./successController.js');
const requestBodyParser = require('../helpers/requestBodyParser.js');
const { RECORDS_NOT_FOUND,
    DATA_GOT_SUCCESSFULLY,
    SERVER_ERROR,
    MISSING_ID,
    MISSING_FIELDS,
    USER_NOT_FOUND,
    YOU_ARE_NOT_AUTHORIZED,
    RECORD_CREATED_SUCCESSFULLY,
    RECORD_WAS_NOT_CREATED,
    RECORD_DELETED_SUCCESSFULLY,
    RECORD_UPDATED_SUCCESSFULLY,
    UPDATE_RECORD_FAILED,
    MISSING_RECOED_ID } = require('../configs/messages.js');

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

const deleteNews = async (req, res) => {
    const reqBody = await requestBodyParser(req);
    let client;
    try {
        const {
            id,
            news_id
        } = reqBody ?? {};

        if (id == null) {
            return errorHandler(res, 400, MISSING_ID, {
                success: false,
                message: MISSING_ID
            });
        }

        if (news_id == null) {
            return errorHandler(res, 400, MISSING_RECOED_ID, {
                success: false,
                message: MISSING_RECOED_ID
            });
        }

        client = await pool.connect();
        const user = await client.query(`SELECT * FROM users WHERE id=$1`, [id]);
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

        const recordExists = await client.query(`SELECT created_at FROM news WHERE id=$1`, [news_id]);
        if (recordExists.rowCount === 0) {
            return errorHandler(res, 404, RECORDS_NOT_FOUND, {
                success: false,
                message: RECORDS_NOT_FOUND
            });
        }

        await client.query(`DELETE FROM news WHERE id=$1`, [news_id]);

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

const updateNews = async (req, res) => {
    const reqBody = await requestBodyParser(req);
    let client;
    try {
        const {
            id,
            news_id,
            title,
            content,
            summary,
            cover_image_url,
            status
        } = reqBody ?? {};

        if (id == null) {
            return errorHandler(res, 400, MISSING_ID, {
                success: false,
                message: MISSING_ID
            });
        }

        if (news_id == null) {
            return errorHandler(res, 400, MISSING_RECOED_ID, {
                success: false,
                message: MISSING_RECOED_ID
            });
        }

        client = await pool.connect();
        const user = await client.query(`SELECT * FROM users WHERE id=$1`, [id]);
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
        const recordExists = await client.query(`SELECT created_at FROM news WHERE id=$1`, [news_id]);

        if (recordExists.rowCount === 0) {
            return errorHandler(res, 404, RECORDS_NOT_FOUND, {
                success: false,
                message: RECORDS_NOT_FOUND
            });
        }

        const updateRecordResult = await client.query(`
            UPDATE news SET
                title=COALESCE($1, title),
                content=COALESCE($2, content),
                cover_image_url=COALESCE($3, cover_image_url),
                summary=COALESCE($4,summary),
                status=COALESCE($5,status),
                published_at=CASE
                    WHEN COALESCE($5,status) = 'published' THEN COALESCE(published_at, NOW())
                    ELSE NULL
                END
            WHERE id=$6`,
            [title ?? null, content ?? null, cover_image_url ?? null, summary ?? null, status ?? null,
            news_id ?? null]);


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

const createNews = async (req, res) => {
    const reqBody = await requestBodyParser(req);
    let client;
    try {
        const {
            id,
            title,
            content,
            summary,
            cover_image_url,
            status,
            created_by
        } = reqBody ?? {};

        if (id == null) {
            return errorHandler(res, 400, MISSING_ID, {
                success: false,
                message: MISSING_ID
            });
        }

        if (title == null || content == null) {
            return errorHandler(res, 400, MISSING_FIELDS, {
                success: false,
                message: MISSING_FIELDS
            });
        }
        

        client = await pool.connect();
        const user = await client.query(`SELECT * FROM users WHERE id=$1`, [id]);
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

        const createAboutUsRecordResult = await client.query(`INSERT INTO news (title,
            content,summary,
            cover_image_url,status,created_by,published_at) VALUES ($1, $2, $3,$4,$5,$6,
            CASE WHEN $5 = 'published' THEN NOW() ELSE NULL END) RETURNING *`, [
            title,
            content,
            summary,
            cover_image_url,
            status ?? 'published',
            id
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


module.exports = { getNews, deleteNews, updateNews, createNews };