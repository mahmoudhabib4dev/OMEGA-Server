const errorHandler = require('../controllers/errorController.js');
const { METHOD_NOT_ALLOWED } = require('../configs/messages.js');
const { getAboutUs, updateAboutUs, deleteAboutUs, createAboutUs } = require('../controllers/aboutUsController.js');

const handleAboutUsRoutes = async (req, res) => {

    switch (req.method) {
        case 'GET':
            await getAboutUs(req, res);
            break;
        case 'PATCH':
            await updateAboutUs(req, res);
        case 'DELETE':
            await deleteAboutUs(req, res);
        case 'POST':
            await createAboutUs(req, res);
        default:
            errorHandler(
                res,
                405,
                `\x1b[31m${METHOD_NOT_ALLOWED}\x1b[0m`,
                { message: METHOD_NOT_ALLOWED }
            );
            break;
    }





};


module.exports = handleAboutUsRoutes;