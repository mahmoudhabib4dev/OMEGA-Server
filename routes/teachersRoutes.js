const errorHandler = require('../controllers/errorController.js');
const { METHOD_NOT_ALLOWED } = require('../configs/messages.js');
const { deleteTeacher, updateTeacher} = require('../controllers/teachersController.js');



const handleDeleteTeacher = async (req, res) => {
    if (req.method === 'DELETE') {
        await deleteTeacher(req, res);
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


const handleUpdateTeacher = async (req, res) => {
    if (req.method === 'DELETE') {
        await updateTeacher(req, res);
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


module.exports = {
    handleDeleteTeacher,
    handleUpdateTeacher
};