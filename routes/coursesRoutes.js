const {
    createCourse,
    deleteCourse,
    updateCourse,
    searchCoursesByNameForTeacher,
    searchCoursesByName,
    searchCoursesStatus
} = require('../controllers/coursesController.js');


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


const handleDeleteCourse = async (req, res) => {
    if (req.method === 'DELETE') {
        await deleteCourse(req, res);
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


const handleUpdateCourse = async (req, res) => {
    if (req.method === 'PATCH') {
        await updateCourse(req, res);
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

const handleSearchCoursesByNameForTeacher = async (req, res) => {
    if (req.method === 'GET') {
        await searchCoursesByNameForTeacher(req, res);
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

const handleSearchCoursesByName = async (req, res) => {
    if (req.method === 'GET') {
        await searchCoursesByName(req, res);
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


const handleSearchCoursesStatus = async (req, res) => {
    if (req.method === 'GET') {
        await searchCoursesStatus(req, res);
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
    handleCreateCourse,
    handleDeleteCourse,
    handleUpdateCourse,
    handleSearchCoursesByNameForTeacher,
    handleSearchCoursesByName,
    handleSearchCoursesStatus
};