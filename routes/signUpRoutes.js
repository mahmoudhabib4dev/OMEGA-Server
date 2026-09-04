#! /api/v1/auth/signup

const signUp = require('../controllers/signUpController.js');
const loggerStatus = require('../helpers/loggingStatus.js');
const errorHandler = require('../controllers/errorController.js');
const { METHOD_NOT_ALLOWED, SIGNUP_SUCCESSFULLY } = require('../configs/messages.js');
const { CONTENT_TYPE, CONTENT_TYPE_VALUE } = require('../configs/constants.js');


const handleSignUpRoutes = (req, res) => {

    if (req.method === 'POST') {
        signUp(res, 200,
            CONTENT_TYPE, CONTENT_TYPE_VALUE,
            `\x1b[32m${SIGNUP_SUCCESSFULLY}\x1b[0m`,
            { message: SIGNUP_SUCCESSFULLY },
            loggerStatus.SUCCESS
        );
    } else {
        errorHandler(
            res,
            405,
            `\x1b[31m${METHOD_NOT_ALLOWED}\x1b[0m`,
            { message: METHOD_NOT_ALLOWED }
        );
    }

};


module.exports = handleSignUpRoutes;