const loggingStatus = require('./loggingStatus.js');


const logger = (message, type) => {
    switch (type) {
        case loggingStatus.ERROR:
            console.log(`\x1b[31m ${message}\x1b[0m`);
            break;
        case loggingStatus.SUCCESS:
            console.log(`\x1b[32m ${message}\x1b[0m`);
            break;
        case loggingStatus.MESSAGE:
            console.log(`\x1b[33m ${message}\x1b[0m`);
            break;
    }
};


module.exports = logger;