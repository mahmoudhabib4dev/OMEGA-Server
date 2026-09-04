const logger = require("../helpers/logger");
const loggerStatus = require('../helpers/loggingStatus.js');
const { VIDEO_UPLOADED_SUCCESSFULLY, FAILED_TO_UPLOAD_VIDEO } = require('../configs/messages.js');
const errorHandler = require('../controllers/errorController.js');


const createrBunnyVideoRecord = async (req, res, videoTitle, fileStream) => {
    const url = `${process.env.BUNNY_LIBRARY}${process.env.LIBRARY_ID}/videos`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'AccessKey': process.env.STREAM_API_KEY
        },
        body: JSON.stringify({ title: videoTitle })
    });

    const data = await response.json();
    const guid = data.guid;
    return guid;

};



const uploadVideoBinaryToBunny = async (videoId, fileStream) => {
    const url = `${process.env.BUNNY_LIBRARY}${process.env.LIBRARY_ID}/videos/${videoId}`;

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'AccessKey': process.env.STREAM_API_KEY,
            'Content-Type': 'application/octet-stream'
        },
        duplex: 'half',
        body: fileStream
    });

    const data = await response.json();
    return data;

};




const uploadVideo = async (req, res, videoTitle, fileStream) => {
    const guid = await createrBunnyVideoRecord(req, res, videoTitle, fileStream);
    try {
        const result = await uploadVideoBinaryToBunny(guid, fileStream);

        res.statusCode = 200;
        res.end(JSON.stringify({
            success: true,
            message: VIDEO_UPLOADED_SUCCESSFULLY,
            videoId: guid
        }));
    } catch (error) {
        errorHandler(res, error.statusCode, FAILED_TO_UPLOAD_VIDEO, error);
    }
};

module.exports = { uploadVideo };