const { createCarouselEntry,
    deleteCarouselEntry,
    updateCarouselEntry,
    getOurTeachers,
    getLatestCourses,
    createLandingPageVideo,
    updateLandingPageVideo,
    deleteLandingPageVideo,
    getLandingPageVideo } = require('../controllers/landingPageController.js');
const errorHandler = require('../controllers/errorController.js');
const { METHOD_NOT_ALLOWED } = require('../configs/messages.js');



const handleCreateCarouselEntryRoute = (req, res) => {

    if (req.method === 'POST') {
        createCarouselEntry(req, res);
    } else {
        errorHandler(
            res,
            405,
            `\x1b[31m${METHOD_NOT_ALLOWED}\x1b[0m`,
            { message: METHOD_NOT_ALLOWED }
        );
    }

};

const handleDeleteCarouselEntryRoute = (req, res) => {

    if (req.method === 'DELETE') {
        deleteCarouselEntry(req, res);
    } else {
        errorHandler(
            res,
            405,
            `\x1b[31m${METHOD_NOT_ALLOWED}\x1b[0m`,
            { message: METHOD_NOT_ALLOWED }
        );
    }

};




const handleUpdateCarouselEntryRoute = (req, res) => {

    if (req.method === 'PATCH') {
        updateCarouselEntry(req, res);
    } else {
        errorHandler(
            res,
            405,
            `\x1b[31m${METHOD_NOT_ALLOWED}\x1b[0m`,
            { message: METHOD_NOT_ALLOWED }
        );
    }

};



const handleGetOurTeahcersRoute = (req, res) => {
    if (req.method === 'GET') {
        getOurTeachers(req, res);
    } else {
        errorHandler(
            res,
            405,
            `\x1b[31m${METHOD_NOT_ALLOWED}\x1b[0m`,
            { message: METHOD_NOT_ALLOWED }
        );
    }
};


const handleGetLatestCoursesRoute = (req, res) => {
    if (req.method === 'GET') {
        getLatestCourses(req, res);
    } else {
        errorHandler(
            res,
            405,
            `\x1b[31m${METHOD_NOT_ALLOWED}\x1b[0m`,
            { message: METHOD_NOT_ALLOWED }
        );
    }
};



const handleCreateLandingPageVideo = (req, res) => {
    if (req.method === 'PUT') {
        createLandingPageVideo(req, res);
    } else {
        errorHandler(
            res,
            405,
            `\x1b[31m${METHOD_NOT_ALLOWED}\x1b[0m`,
            { message: METHOD_NOT_ALLOWED }
        );
    }
};


const handleUpdateLandingPageVideo = (req, res) => {
    if (req.method === 'PATCH') {
        updateLandingPageVideo(req, res);
    } else {
        errorHandler(
            res,
            405,
            `\x1b[31m${METHOD_NOT_ALLOWED}\x1b[0m`,
            { message: METHOD_NOT_ALLOWED }
        );
    }
};


const handleDeleteLandingPageVideo = (req, res) => {
    if (req.method === 'DELETE') {
        deleteLandingPageVideo(req, res);
    } else {
        errorHandler(
            res,
            405,
            `\x1b[31m${METHOD_NOT_ALLOWED}\x1b[0m`,
            { message: METHOD_NOT_ALLOWED }
        );
    }
};


const handleGetLandingPageVideo = (req, res) => {
    if (req.method === 'GET') {
        getLandingPageVideo(req, res);
    } else {
        errorHandler(
            res,
            405,
            `\x1b[31m${METHOD_NOT_ALLOWED}\x1b[0m`,
            { message: METHOD_NOT_ALLOWED }
        );
    }
};

module.exports = {
    handleCreateCarouselEntryRoute,
    handleDeleteCarouselEntryRoute,
    handleUpdateCarouselEntryRoute,
    handleGetOurTeahcersRoute,
    handleGetLatestCoursesRoute,
    handleCreateLandingPageVideo,
    handleUpdateLandingPageVideo,
    handleDeleteLandingPageVideo,
    handleGetLandingPageVideo
};