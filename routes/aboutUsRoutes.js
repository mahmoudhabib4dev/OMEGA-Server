const errorHandler = require('../controllers/errorController.js');
const { METHOD_NOT_ALLOWED } = require('../configs/messages.js');
const { getAboutUs, updateAboutUs, deleteAboutUs, createAboutUs } = require('../controllers/aboutUsController.js');

const handleAboutUsRoutes = async (req, res) => {
    if (req.method === 'GET') {
        await getAboutUs(req, res);
    }
    else if (req.method === 'PATCH') {
        await updateAboutUs(req, res);
    } else
        if (req.method === 'DELETE') {
            await deleteAboutUs(req, res);
        } else if (req.method === 'POST') {
            await createAboutUs(req, res);
        } {
        errorHandler(
            res,
            405,
            `\x1b[31m${METHOD_NOT_ALLOWED}\x1b[0m`,
            { message: METHOD_NOT_ALLOWED }
        );
    }

};


module.exports = handleAboutUsRoutes;