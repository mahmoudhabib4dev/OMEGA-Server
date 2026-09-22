require('dotenv').config();
const { createServer } = require('node:http');
const errorHandler = require('./controllers/errorController.js');
const { handleSignUpTeacherRoutes, handleSignUpStudentRoutes } = require('./routes/signUpRoutes.js');
const { handleUpdateStudent, handleDeleteStudent, handleEnrollInCourse } = require('./routes/studentsRoutes.js');
const { handleUpdateTeacher, handleDeleteTeacher } = require('./routes/teachersRoutes.js');
const { handleUploadVideoRoute } = require('./routes/videoRoutes.js');
const handleErrorsRoutes = require('./routes/errorsRoutes.js');
const logger = require('./helpers/logger.js');
const loggerStatus = require('./helpers/loggingStatus.js');
const checkDBConnection = require('./helpers/dbConnectionChecker.js');
const otpGenerator = require('./helpers/otpGenerator.js');
const {
    TEACHER_SIGNUP_PATH,
    STUDENT_SIGNUP_PATH,
    VIDEO_UPLOAD_PATH,
    IMAGE_UPLOAD_PATH,
    CREATE_COURSE_PATH,
    DELETE_COURSE_PATH,
    UPDATE_COURSE_PATH,
    SEARCH_COURSES_BY_NAME_FOR_TEACHER_PATH,
    SEARCH_COURSES_BY_NAME_PATH,
    GET_COURSES_STATUS_PATH,
    SEARCH_COURSES_BY_TEACHER_NAME_PATH,
    CREATE_CAROUSEL_ENTRY_PATH,
    DELETE_CAROUSEL_ENTRY_PATH,
    UPDATE_CAROUSEL_ENTRY_PATH,
    GET_OUR_TEACHERS_PATH,
    GET_OUT_COURSES_PATH,
    GET_LANDING_PAGE_VIDEO_PATH,
    CREATE_LANDING_PAGE_VIDEO_PATH,
    UPDATE_LANDING_PAGE_VIDEO_PATH,
    DELETE_LANDING_PAGE_VIDEO_PATH,
    LOGIN_PATH,
    UPDATE_STUDENT_PATH,
    UPDATE_TEACHER_PATH,
    DELETE_STUDENT_PATH,
    DELETE_TEACHER_PATH,
    GET_COURSES_ACCORDING_TO_YEAR_PATH,
    ENROLL_IN_COURSE,
    CONTACT_US_PATH,
    NEWS_PATH,
    ABOUT_US_PATH,
    SEARCH_COURSES_FROM_NEW_TO_OLD_PATH,
    SEARCH_COURSES_FROM_OLD_TO_NEW_PATH

} = require('./configs/paths.js');
const handleUploadImageRoute = require('./routes/imageRoutes.js');
const {
    handleCreateCourse,
    handleDeleteCourse,
    handleUpdateCourse,
    handleSearchCoursesByNameForTeacher,
    handleSearchCoursesByName,
    handleSearchCoursesStatus,
    handleSearchCoursesByTeacherName,
    handleSearchCoursesAccordingToYears,
    handelSearchCoursesFromNewToOld,
    handelSearchCoursesFromOldToNew
} = require('./routes/coursesRoutes.js');
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
const handleNewsRoutes = require('./routes/newsRoutes.js');
const handleContactUsRoutes = require('./routes/contactUsRoutes.js');
const handleAboutUsRoutes = require('./routes/aboutUsRoutes.js');


const port = process.env.PORT;
const host = process.env.HOST;

const server = createServer((req, res) => {

    let routeHandler;
    switch (req.url) {
        case LOGIN_PATH:
            routeHandler = handleLoginRoutes;
            break;
        case TEACHER_SIGNUP_PATH:
            routeHandler = handleSignUpTeacherRoutes;
            break;
        case STUDENT_SIGNUP_PATH:
            routeHandler = handleSignUpStudentRoutes;
            break;
        case UPDATE_STUDENT_PATH:
            routeHandler = handleUpdateStudent;
            break;
        case UPDATE_TEACHER_PATH:
            routeHandler = handleUpdateTeacher;
            break;
        case DELETE_STUDENT_PATH:
            routeHandler = handleDeleteStudent;
            break;
        case DELETE_TEACHER_PATH:
            routeHandler = handleDeleteTeacher;
            break;
        case VIDEO_UPLOAD_PATH:
            routeHandler = handleUploadVideoRoute;
            break;
        case IMAGE_UPLOAD_PATH:
            routeHandler = handleUploadImageRoute;
            break;
        case CREATE_COURSE_PATH:
            routeHandler = handleCreateCourse;
            break;
        case DELETE_COURSE_PATH:
            routeHandler = handleDeleteCourse;
            break;
        case UPDATE_COURSE_PATH:
            routeHandler = handleUpdateCourse;
            break;
        case SEARCH_COURSES_BY_NAME_FOR_TEACHER_PATH:
            routeHandler = handleSearchCoursesByNameForTeacher;
            break;
        case SEARCH_COURSES_BY_NAME_PATH:
            routeHandler = handleSearchCoursesByName;
            break;
        case GET_COURSES_STATUS_PATH:
            routeHandler = handleSearchCoursesStatus;
            break;
        case SEARCH_COURSES_BY_TEACHER_NAME_PATH:
            routeHandler = handleSearchCoursesByTeacherName;
            break;
        case CREATE_CAROUSEL_ENTRY_PATH:
            routeHandler = handleCreateCarouselEntryRoute;
            break;
        case DELETE_CAROUSEL_ENTRY_PATH:
            routeHandler = handleDeleteCarouselEntryRoute;
            break;
        case UPDATE_CAROUSEL_ENTRY_PATH:
            routeHandler = handleUpdateCarouselEntryRoute;
            break;
        case GET_OUR_TEACHERS_PATH:
            routeHandler = handleGetOurTeahcersRoute;
            break;
        case GET_OUT_COURSES_PATH:
            routeHandler = handleGetLatestCoursesRoute;
            break;
        case GET_LANDING_PAGE_VIDEO_PATH:
            routeHandler = handleGetLandingPageVideo;
            break;
        case CREATE_LANDING_PAGE_VIDEO_PATH:
            routeHandler = handleCreateLandingPageVideo;
            break;
        case UPDATE_LANDING_PAGE_VIDEO_PATH:
            routeHandler = handleUpdateLandingPageVideo;
            break;
        case DELETE_LANDING_PAGE_VIDEO_PATH:
            routeHandler = handleDeleteLandingPageVideo;
            break;
        case GET_COURSES_ACCORDING_TO_YEAR_PATH:
            routeHandler = handleSearchCoursesAccordingToYears;
            break;
        case ENROLL_IN_COURSE:
            routeHandler = handleEnrollInCourse;
            break;
        case CONTACT_US_PATH:
            routeHandler = handleContactUsRoutes;
            break;
        case NEWS_PATH:
            routeHandler = handleNewsRoutes;
            break;
        case ABOUT_US_PATH:
            routeHandler = handleAboutUsRoutes
            break;
        case SEARCH_COURSES_FROM_NEW_TO_OLD_PATH:
            routeHandler = handelSearchCoursesFromNewToOld;
            break;
        case SEARCH_COURSES_FROM_OLD_TO_NEW_PATH:
            routeHandler = handelSearchCoursesFromOldToNew;
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



