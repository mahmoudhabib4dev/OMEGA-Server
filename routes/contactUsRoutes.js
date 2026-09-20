const errorHandler = require('../controllers/errorController.js');
const { METHOD_NOT_ALLOWED } = require('../configs/messages.js');
const contactUs = require ('../controllers/contactUsController.js');

const handleContactUsRoutes = async (req, res) => {
    if (req.method === 'POST') {
        await contactUs(req, res);
    }
    else {
        errorHandler(
            res,
            405,
            `\x1b[31m${METHOD_NOT_ALLOWED}\x1b[0m`,
            { message: METHOD_NOT_ALLOWED }
        );
    }

};


module.exports = handleContactUsRoutes;