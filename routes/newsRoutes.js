const errorHandler = require('../controllers/errorController.js');
const { METHOD_NOT_ALLOWED } = require('../configs/messages.js');
const { getNews, deleteNews, updateNews, createNews } = require('../controllers/newsController.js');

const handleNewsRoutes = async (req, res) => {


    switch (req.method) {
        case 'GET':
            await getNews(req, res);
            break;
        case 'POST':
            await createNews(req, res);
            break;
        case 'DELETE':
            await deleteNews(req, res);
            break;
        case 'PATCH':
            await updateNews(req, res);
            break;
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


module.exports = handleNewsRoutes;