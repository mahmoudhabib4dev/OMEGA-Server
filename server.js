require('dotenv').config();
const { createServer } = require('node:http');
const errorHandler = require('./controllers/errorController.js');
const handleSignUpRoutes = require('./routes/signUpRoutes.js');
const { handleUploadVideoRoute } = require('./routes/videoRoutes.js');
const handleErrorsRoutes = require('./routes/errorsRoutes.js');
const logger = require('./helpers/logger.js');
const loggerStatus = require('./helpers/loggingStatus.js');
const checkDBConnection = require('./helpers/dbConnectionChecker.js');
const {
    TEACHER_SIGNUP_PATH,
    VIDEO_UPLOAD_PATH,
    IMAGE_UPLOAD_PATH,
    CREATE_COURSE,
    DELETE_COURSE,
    UPDATE_COURSE,
    SEARCH_COURSES_BY_NAME_FOR_TEACHER,
    SEARCH_COURSES_BY_NAME,
    GET_COURSES_STATUS
} = require('./configs/paths.js');
const handleUploadImageRoute = require('./routes/imageRoutes.js');
const { handleCreateCourse,
    handleDeleteCourse,
    handleUpdateCourse,
    handleSearchCoursesByNameForTeacher,
    handleSearchCoursesByName,
    handleSearchCoursesStatus } = require('./routes/coursesRoutes.js');


const port = process.env.PORT;
const host = process.env.HOST;

const server = createServer((req, res) => {

    let routeHandler;
    switch (req.url) {
        case TEACHER_SIGNUP_PATH:
            routeHandler = handleSignUpRoutes;
            break;
        case VIDEO_UPLOAD_PATH:
            routeHandler = handleUploadVideoRoute;
            break;
        case IMAGE_UPLOAD_PATH:
            routeHandler = handleUploadImageRoute;
            break;
        case CREATE_COURSE:
            routeHandler = handleCreateCourse;
            break;
        case DELETE_COURSE:
            routeHandler = handleDeleteCourse;
            break;
        case UPDATE_COURSE:
            routeHandler = handleUpdateCourse;
            break;
        case SEARCH_COURSES_BY_NAME_FOR_TEACHER:
            routeHandler = handleSearchCoursesByNameForTeacher;
            break;
        case SEARCH_COURSES_BY_NAME:
            routeHandler = handleSearchCoursesByName;
            break;
        case GET_COURSES_STATUS:
            routeHandler = handleSearchCoursesStatus;
            break;
        default:
            routeHandler = handleErrorsRoutes;
    }

    Promise.resolve()
        .then(() => routeHandler(req, res))
        .catch(error => {
            const statusCode = error.statusCode || 500;
            const message = error.publicMessage || 'Internal server error';
            if (!res.writableEnded) {
                errorHandler(res, statusCode, error.message, {
                    success: false,
                    message
                });
            }
        });
});


server.listen(port, host, async () => {
    try {
        await checkDBConnection();
    } catch (error) {
        logger(error, loggerStatus.ERROR);
    }

    logger(`Server is running on  http://${host}:${port}`, loggerStatus.SUCCESS);
});



