require('dotenv').config();
const { createServer } = require('node:http');
const handleSignUpRoutes = require('./routes/signUpRoutes.js');
const { handleUploadVideoRoute } = require('./routes/videoRoutes.js');
const handleErrorsRoutes = require('./controllers/errorController.js');
const logger = require('./helpers/logger.js');
const loggerStatus = require('./helpers/loggingStatus.js');
const checkDBConnection = require('./helpers/dbConnectionChecker.js');
const { TEACHER_SIGNUP_PATH, VIDEO_UPLOAD_PATH } = require('./configs/paths.js');


const port = process.env.PORT;
const host = process.env.HOST;

const server = createServer((req, res) => {
    
    switch (req.url) {
        case TEACHER_SIGNUP_PATH:
            handleSignUpRoutes(req, res);
            break;
        case VIDEO_UPLOAD_PATH:
            handleUploadVideoRoute(req, res);
            break;
        default:
            handleErrorsRoutes(req, res);
            break;
    }
});


server.listen(port, host, async () => {
    try {
        await checkDBConnection();
    } catch (error) {
        logger(error, loggerStatus.ERROR);
    }

    logger(`Server is running on  http://${host}:${port}`, loggerStatus.SUCCESS);
});



