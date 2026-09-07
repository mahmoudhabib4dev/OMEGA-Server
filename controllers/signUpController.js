const pool = require('../configs/db.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../helpers/logger.js');
const loggerStatus = require('../helpers/loggingStatus.js');
const requestBodyParser = require('../helpers/requestBodyParser.js');
const { REQUIRED_FIELDS_MESSING, MISSING_FIELDS, ROLE_ERROR } = require('../configs/messages.js');
const errorHandler = require('./errorController.js');

const signUpTeacher = async (req, res) => {

    const reqBody = await requestBodyParser(req);
    let client;
    try {
        const {
            full_name,
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
            current_city
        } = reqBody;

        if (!full_name || !phone || !password || !specialty || !title || !license_number || years_experience === undefined) {
            return errorHandler(res, 400, MISSING_FIELDS, {
                success: false,
                message: REQUIRED_FIELDS_MESSING
            });
        }


        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        client = await pool.connect();
        await client.query('BEGIN');

        const roleRes = await client.query('SELECT id FROM roles WHERE LOWER(name) = $1', ['teacher']);
        if (roleRes.rows.length === 0) {
            await client.query('ROLLBACK');
            return errorHandler(res, 500, ROLE_ERROR, { success: false, message: TEACHER_ROLE_DOES_NOT_EXIST });
        }
        const teacherRoleId = roleRes.rows[0].id;


        const insertUserQuery = `
            INSERT INTO users (full_name, phone, email, password_hash, avatar_url, role_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, full_name, phone, email, avatar_url, role_id;
        `;
        const userRes = await client.query(insertUserQuery, [
            full_name,
            phone,
            email || null,
            password_hash,
            avatar_url,
            teacherRoleId
        ]);
        const newUser = userRes.rows[0];


        const insertTeacherQuery = `
            INSERT INTO teachers (user_id, specialty, title, license_number, years_experience, workplace, bio, current_city, approval_status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
            RETURNING specialty, title, license_number, approval_status;
        `;
        const teacherRes = await client.query(insertTeacherQuery, [
            newUser.id,
            specialty,
            title,
            license_number,
            years_experience,
            workplace || null,
            bio || null,
            current_city || null
        ]);

        await client.query('COMMIT');



        return successHandler(res, 201, 'Teacher registered successfully', {
            success: true,
            message: 'Teacher registered successfully and pending approval.',
            token,
            user: {
                id: newUser.id,
                full_name: newUser.full_name,
                phone: newUser.phone,
                email: newUser.email,
                avatar_url: newUser.avatar_url,
                teacher_details: teacherRes.rows[0]
            }
        });
    } catch (error) {
        if (client) await client.query('ROLLBACK');

        if (error.code === '23505') {
            return errorHandler(res, 409, 'Conflict', { success: false, message: 'Phone, email, or license number already exists' });
        }

        return errorHandler(res, 500, error.message, { success: false, message: 'Server internal error' });
    } finally {
        if (client) client.release();
    }










};




module.exports = { signUpTeacher };