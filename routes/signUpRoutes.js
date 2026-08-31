#! /api/v1/auth/signup

const signUpController = require('../controllers/signUpController.js');
const loggerStatus = require('../helpers/loggingStatus.js');


const handleSignUpRoutes = (req, res) => {

    if (req.method === 'POST') {
        signUpController(res, 200,
            'Content-Type', 'application/json',
            '\x1b[32msign up successfully\x1b[0m',
            { message: 'sign up successfully' },
            loggerStatus.SUCCESS 
        );
    } else {
        signUpController(res, 405,
            'Content-Type', 'application/json',
            '\x1b[31mOnly post metho is allowed\x1b[0m',
            { message: 'Only post metho is allowed' },
            loggerStatus.ERROR
        );
    }

};


module.exports = handleSignUpRoutes;