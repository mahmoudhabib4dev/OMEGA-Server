const { PAGE_NOT_FOUND } = require('../configs/messages.js');
const errorHandler = require('../controllers/errorController.js');

const handleErrorsRoutes = (req, res) => {

    errorHandler(
        res,
        404,
        `\x1b[31m${PAGE_NOT_FOUND}\x1b[0m`,
        { message: PAGE_NOT_FOUND }
       
    );

};


module.exports = handleErrorsRoutes;