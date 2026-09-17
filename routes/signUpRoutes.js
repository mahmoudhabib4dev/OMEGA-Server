#! /api/v1/auth/signup

const { signUpTeacher, signUpStudent } = require('../controllers/signUpController.js');
const errorHandler = require('../controllers/errorController.js');
const { METHOD_NOT_ALLOWED } = require('../configs/messages.js');



const handleSignUpTeacherRoutes = (req, res) => {

    if (req.method === 'POST') {
        signUpTeacher(req, res);
    } else {
        errorHandler(
            res,
            405,
            `\x1b[31m${METHOD_NOT_ALLOWED}\x1b[0m`,
            { message: METHOD_NOT_ALLOWED }
        );
    }

};



const handleSignUpStudentRoutes = (req, res) => {

    if (req.method === 'POST') {
        signUpStudent(req, res);
    } else {
        errorHandler(
            res,
            405,
            `\x1b[31m${METHOD_NOT_ALLOWED}\x1b[0m`,
            { message: METHOD_NOT_ALLOWED }
        );
    }

};




module.exports = { handleSignUpTeacherRoutes, handleSignUpStudentRoutes };