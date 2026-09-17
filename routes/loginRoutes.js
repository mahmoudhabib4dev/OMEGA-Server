const login = require('../controllers/loginController.js');
const errorHandler = require('../controllers/errorController.js');
const { METHOD_NOT_ALLOWED } = require('../configs/messages.js');


const handleLoginRoutes = (req, res) => {

    if (req.method === 'POST') {
        login(req, res);
    } else {
        errorHandler(
            res,
            405,
            `\x1b[31m${METHOD_NOT_ALLOWED}\x1b[0m`,
            { message: METHOD_NOT_ALLOWED }
        );
    }

};


module.exports = handleLoginRoutes;