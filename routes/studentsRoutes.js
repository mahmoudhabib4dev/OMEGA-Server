const errorHandler = require('../controllers/errorController.js');
const { METHOD_NOT_ALLOWED } = require('../configs/messages.js');
const { deleteStudent, updateStudent } = require('../controllers/studentsController.js');


const handleDeleteStudent = async (req, res) => {
    if (req.method === 'DELETE') {
        await deleteStudent(req, res);
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


const handleUpdateStudent = async (req, res) => {
    if (req.method === 'DELETE') {
        await updateStudent(req, res);
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
    handleUpdateStudent,
    handleDeleteStudent
};