const { createCourse } = require('../controllers/coursesController.js');


const handleCreateCourse = async (req, res) => {
    if (req.method === 'POST') {
        await createCourse(req, res);
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


module.exports = { handleCreateCourse };