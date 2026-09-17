const pool = require('../configs/db.js');
const requestBodyParser = require('../helpers/requestBodyParser.js');
const errorHandler = require('./errorController.js');
const successHandler = require('../controllers/successController.js');
const {
    MISSING_ID,
    SERVER_ERROR,
    USER_NOT_FOUND,
    YOU_ARE_NOT_AUTHORIZED,
    CAROUSEL_ENTRY_WAS_NOT_CREATED,
    CAROUSEL_ENTRY_CREATED_SUCCESSFULLY,
    CAROUSEL_DELETED_SUCCESSFULLY,
    MISSING_SLIDE_ID,
    SLIDE_NOT_FOUND,
    UPDATE_SLIDE_FAILED,
    UPDATE_SLIDE_SUCCESSFULLY,
    USERS_NOT_FOUND,
    TEACHERS_GOT_SUCCESSFULLY,
    COURSES_NOT_FOUND,
    VIDEO_ENTRY_WAS_NOT_CREATED,
    VIDEO_ENTRY_CREATED_SUCCESSFULLY,
    MISSING_URL,
    VIDEO_ENTRY_WAS_NOT_UPDATED,
    VIDEO_ENTRY_UPDATED_SUCCESSFULLY,
    VIDEO_ENTRY_WAS_NOT_DELETED,
    VIDEO_ENTRY_DELETED_SUCCESSFULLY,
    VIDEO_NOT_FOUND,
    VIDEO_FOUND_SUCCESSFULLY
} = require('../configs/messages.js');

const createCarouselEntry = async (req, res) => {
    const reqBody = await requestBodyParser(req);
    let client;

    try {
        client = await pool.connect();
        const { id, image_url, title, subtitle, content, btn_link } = reqBody;
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

        const createCarouselEntryResult = await client.query(`INSERT INTO home_carousel (img , title , subtitle , content , btn_link) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *`, [
            image_url, title, subtitle, content, btn_link
        ]);

        if (createCarouselEntryResult.rowCount !== 1) {
            return errorHandler(res, 500, CAROUSEL_ENTRY_WAS_NOT_CREATED, { success: false, message: SERVER_ERROR });
        }

        return successHandler(res, 201, CAROUSEL_ENTRY_CREATED_SUCCESSFULLY, {
            success: true,
            message: CAROUSEL_ENTRY_CREATED_SUCCESSFULLY,
            carousel: createCarouselEntryResult.rows[0]
        });

    } catch (error) {
        return errorHandler(res, 500, error.message, { success: false, message: SERVER_ERROR });
    } finally {
        if (client) client.release();
    }
};

const deleteCarouselEntry = async (req, res) => {
    const reqBody = await requestBodyParser(req);
    let client;
    try {
        client = await pool.connect();
        const { id, slide_id } = reqBody;
        const user = await client.query(`SELECT * FROM users WHERE id=$1`, [id]);
        if (id === undefined) {
            return errorHandler(res, 400, MISSING_ID, {
                success: false,
                message: MISSING_ID
            });
        }
        if (slide_id === undefined) {
            return errorHandler(res, 400, MISSING_SLIDE_ID, {
                success: false,
                message: MISSING_SLIDE_ID
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

        await client.query(`DELETE FROM home_carousel WHERE id=$1`, [slide_id]);

        return successHandler(res, 200, CAROUSEL_DELETED_SUCCESSFULLY, {
            success: true,
            message: CAROUSEL_DELETED_SUCCESSFULLY
        });
    } catch (error) {
        return errorHandler(res, 500, error.message, { success: false, message: SERVER_ERROR });
    } finally {
        if (client) client.release();
    }


};

const updateCarouselEntry = async (req, res) => {
    const reqBody = await requestBodyParser(req);
    let client;
    try {
        client = await pool.connect();
        const { id, slide_id, image_url, title, subtitle, content, btn_link } = reqBody;
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

        const slideExists = await client.query(`SELECT title FROM home_carousel WHERE id=$1`, [slide_id]);

        if (slideExists.rowCount === 0) {
            return errorHandler(res, 404, SLIDE_NOT_FOUND, {
                success: false,
                message: SLIDE_NOT_FOUND
            });
        }


        const updateSlideResult = await client.query(`
            UPDATE  home_carousel SET title=COALESCE($1, title) ,
             img=COALESCE($2, img) ,
             subtitle=COALESCE($3, subtitle), 
             content=COALESCE($4, content),
             btn_link=COALESCE($5, btn_link)
             WHERE id=$6`,
            [title ?? null, image_url ?? null, subtitle ?? null, content ?? null, btn_link ?? null, slide_id]);


        if (updateSlideResult.rowCount === 0) {
            return errorHandler(res, 400, UPDATE_SLIDE_FAILED, {
                success: false,
                message: UPDATE_SLIDE_FAILED
            });
        }

        return successHandler(res, 200, UPDATE_SLIDE_SUCCESSFULLY, {
            success: true,
            message: UPDATE_SLIDE_SUCCESSFULLY
        });
    } catch (error) {
        return errorHandler(res, 500, error.message, { success: false, message: SERVER_ERROR });
    } finally {
        if (client) client.release();
    }
};


const getOurTeachers = async (req, res) => {

    let client;
    try {
        client = await pool.connect();
        const selectAllTeachersQueryResult = await client.query(`
    SELECT
        users.full_name,
        users.avatar_url,
        teachers.specialty
    FROM users
    INNER JOIN teachers
        ON teachers.user_id = users.id
    WHERE users.is_active = TRUE
`);

        if (selectAllTeachersQueryResult.rowCount === 0) {
            return errorHandler(res, 400, USERS_NOT_FOUND, {
                success: false,
                message: USERS_NOT_FOUND
            });
        }
        return successHandler(res, 201, TEACHERS_GOT_SUCCESSFULLY, {
            success: true,
            message: TEACHERS_GOT_SUCCESSFULLY,
            teachers: selectAllTeachersQueryResult.rows
        });

    } catch (error) {
        return errorHandler(res, 500, error.message, { success: false, message: SERVER_ERROR });
    } finally {
        if (client) client.release();
    }

};


const getLatestCourses = async (req, res) => {
    let client;
    try {
        client = await pool.connect();
        const getLatestCoursesQueryResult = await client.query(`
    SELECT
        courses.title,
        courses.description,
        courses.cover_image_url,
        users.full_name AS teacher_name
    FROM courses
    INNER JOIN teachers
        ON teachers.user_id = courses.teacher_id
    INNER JOIN users
        ON users.id = teachers.user_id
    WHERE courses.status = 'published'
      AND users.is_active = TRUE
    ORDER BY courses.published_at DESC NULLS LAST
    LIMIT 5
`);

        if (getLatestCoursesQueryResult.rowCount === 0) {
            return errorHandler(res, 400, COURSES_NOT_FOUND, {
                success: false,
                message: COURSES_NOT_FOUND
            });
        }
        return successHandler(res, 201, COURSES_FOUND_SUCCESSFULLY, {
            success: true,
            message: COURSES_FOUND_SUCCESSFULLY,
            teachers: getLatestCoursesQueryResult.rows
        });

    } catch (error) {
        return errorHandler(res, 500, error.message, { success: false, message: SERVER_ERROR });
    } finally {
        if (client) client.release();
    }
};


const createLandingPageVideo = async (req, res) => {
    const reqBody = await requestBodyParser(req);
    let client;
    try {

        client = await pool.connect();
        const { id, video_url } = reqBody;
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
        if (video_url === undefined) {
            return errorHandler(res, 400, MISSING_URL, {
                success: false,
                message: MISSING_URL
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


        const createLandingPageVideoResult = await client.query(`INSERT INTO landing_page_video (url) 
            VALUES ($1) RETURNING *`, [
            video_url
        ]);

        if (createLandingPageVideoResult.rowCount !== 1) {
            return errorHandler(res, 500, VIDEO_ENTRY_WAS_NOT_CREATED, { success: false, message: SERVER_ERROR });
        }

        return successHandler(res, 201, VIDEO_ENTRY_CREATED_SUCCESSFULLY, {
            success: true,
            message: VIDEO_ENTRY_CREATED_SUCCESSFULLY,
            video: createLandingPageVideoResult.rows[0]
        });

    } catch (error) {
        return errorHandler(res, 500, error.message, { success: false, message: SERVER_ERROR });
    } finally {
        if (client) client.release();
    }
}


const updateLandingPageVideo = async (req, res) => {
    const reqBody = await requestBodyParser(req);
    let client;
    try {
        client = await pool.connect();
        const { id, video_url } = reqBody ?? {};
        if (id === undefined) {
            return errorHandler(res, 400, MISSING_ID, {
                success: false,
                message: MISSING_ID
            });
        }
        const user = await client.query(`SELECT * FROM users WHERE id=$1`, [id]);
        if (user.rowCount === 0) {
            return errorHandler(res, 400, USER_NOT_FOUND, {
                success: false,
                message: USER_NOT_FOUND
            });
        }
        if (video_url === undefined) {
            return errorHandler(res, 400, MISSING_URL, {
                success: false,
                message: MISSING_URL
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


        const updateLandingPageVideoResult = await client.query(`UPDATE landing_page_video SET url=$1 RETURNING *`, [
            video_url
        ]);

        if (updateLandingPageVideoResult.rowCount !== 1) {
            return errorHandler(res, 500, VIDEO_ENTRY_WAS_NOT_UPDATED, { success: false, message: SERVER_ERROR });
        }

        return successHandler(res, 201, VIDEO_ENTRY_UPDATED_SUCCESSFULLY, {
            success: true,
            message: VIDEO_ENTRY_UPDATED_SUCCESSFULLY,
            video: updateLandingPageVideoResult.rows[0]
        });

    } catch (error) {
        return errorHandler(res, 500, error.message, { success: false, message: SERVER_ERROR });
    } finally {
        if (client) client.release();
    }
}


const deleteLandingPageVideo = async (req, res) => {
    const reqBody = await requestBodyParser(req);
    let client;
    try {
        client = await pool.connect();
        const { id } = reqBody ?? {};
        if (id === undefined) {
            return errorHandler(res, 400, MISSING_ID, {
                success: false,
                message: MISSING_ID
            });
        }
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


        const deleteLandingPageVideoResult = await client.query(`DELETE FROM landing_page_video`);

        if (deleteLandingPageVideoResult.rowCount !== 1) {
            return errorHandler(res, 500, VIDEO_ENTRY_WAS_NOT_DELETED, { success: false, message: SERVER_ERROR });
        }

        return successHandler(res, 201, VIDEO_ENTRY_DELETED_SUCCESSFULLY, {
            success: true,
            message: VIDEO_ENTRY_DELETED_SUCCESSFULLY,

        });

    } catch (error) {
        return errorHandler(res, 500, error.message, { success: false, message: SERVER_ERROR });
    } finally {
        if (client) client.release();
    }
}



const getLandingPageVideo = async (req, res) => {
  
    let client;
    try {
        client = await pool.connect();
         const getLandingPageVideoQueryResult = await client.query(`SELECT * FROM landing_page_video`);

        if (getLandingPageVideoQueryResult.rowCount === 0) {
            return errorHandler(res, 400, VIDEO_NOT_FOUND, {
                success: false,
                message: VIDEO_NOT_FOUND
            });
        }
        return successHandler(res, 201, VIDEO_FOUND_SUCCESSFULLY, {
            success: true,
            message: VIDEO_FOUND_SUCCESSFULLY,
            video: getLandingPageVideoQueryResult.rows
        });


    } catch (error) {
        return errorHandler(res, 500, error.message, { success: false, message: SERVER_ERROR });
    } finally {
        if (client) client.release();
    }
}
module.exports = {
    createCarouselEntry,
    deleteCarouselEntry,
    updateCarouselEntry,
    getOurTeachers,
    getLatestCourses,
    createLandingPageVideo,
    updateLandingPageVideo,
    deleteLandingPageVideo,
    getLandingPageVideo
};