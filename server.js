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
    GET_COURSES_STATUS,
    SEARCH_COURSES_BY_TEACHER_NAME,
    CREATE_CAROUSEL_ENTRY,
    DELETE_CAROUSEL_ENTRY,
    UPDATE_CAROUSEL_ENTRY,
    GET_OUR_TEACHERS,
    GET_OUT_COURSES,
    GET_LANDING_PAGE_VIDEO,
    CREATE_LANDING_PAGE_VIDEO,
    UPDATE_LANDING_PAGE_VIDEO,
    DELETE_LANDING_PAGE_VIDEO, 
    LOGIN_PATH
} = require('./configs/paths.js');
const handleUploadImageRoute = require('./routes/imageRoutes.js');
const {
    handleCreateCourse,
    handleDeleteCourse,
    handleUpdateCourse,
    handleSearchCoursesByNameForTeacher,
    handleSearchCoursesByName,
    handleSearchCoursesStatus,
    handleSearchCoursesByTeacherName } = require('./routes/coursesRoutes.js');
const {
    handleCreateCarouselEntryRoute,
    handleDeleteCarouselEntryRoute,
    handleUpdateCarouselEntryRoute,
    handleGetOurTeahcersRoute,
    handleGetLatestCoursesRoute,
    handleCreateLandingPageVideo,
    handleUpdateLandingPageVideo,
    handleDeleteLandingPageVideo,
    handleGetLandingPageVideo
} = require('./routes/landingPageRoutes.js');

const handleLoginRoutes = require('./routes/loginRoutes.js');


const port = process.env.PORT;
const host = process.env.HOST;

const server = createServer((req, res) => {

    let routeHandler;
    switch (req.url) {
        case LOGIN_PATH:
            routeHandler = handleLoginRoutes;
            break;
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
        case SEARCH_COURSES_BY_TEACHER_NAME:
            routeHandler = handleSearchCoursesByTeacherName;
            break;
        case CREATE_CAROUSEL_ENTRY:
            routeHandler = handleCreateCarouselEntryRoute;
            break;
        case DELETE_CAROUSEL_ENTRY:
            routeHandler = handleDeleteCarouselEntryRoute;
            break;
        case UPDATE_CAROUSEL_ENTRY:
            routeHandler = handleUpdateCarouselEntryRoute;
            break;
        case GET_OUR_TEACHERS:
            routeHandler = handleGetOurTeahcersRoute;
            break;
        case GET_OUT_COURSES:
            routeHandler = handleGetLatestCoursesRoute;
            break;
        case GET_LANDING_PAGE_VIDEO:
            routeHandler = handleGetLandingPageVideo;
            break;
        case CREATE_LANDING_PAGE_VIDEO:
            routeHandler = handleCreateLandingPageVideo;
            break;
        case UPDATE_LANDING_PAGE_VIDEO:
            routeHandler = handleUpdateLandingPageVideo;
            break;
        case DELETE_LANDING_PAGE_VIDEO:
            routeHandler = handleDeleteLandingPageVideo;
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



