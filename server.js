require('dotenv').config();
const { createServer } = require('node:http');
const handleSignUpRoutes = require('./routes/signUpRoutes.js');
const logger = require('./helpers/logger.js');
const loggerStatus = require('./helpers/loggingStatus.js');
const checkDBConnection = require('./helpers/dbConnectionChecker.js');
const signUpController = require('./controllers/signUpController.js');


const port = process.env.PORT;
const host = process.env.HOST;

const server = createServer((req, res) => {


    if (req.url === '/api/v1/auth/signup') {
        handleSignUpRoutes(req, res);
    } else {
        signUpController(res,
            404,
            'Content-Type', 'application/json',
            '\x1b[31mNot Found\x1b[0m',
            { message: 'Not found!' },
            loggerStatus.ERROR
        );
    }

});


server.listen(port, host, async () => {
    try {
        await checkDBConnection();
    } catch (error) {
        logger(error, loggerStatus.ERROR);
    }

    logger(`Server is running on  http://${host}/${port}`, loggerStatus.SUCCESS);
});