const { VIDEO_UPLOADED_SUCCESSFULLY, FAILED_TO_UPLOAD_VIDEO, INVALID_CONTENT_TYPE, MALEFORMED_HEADERS, ERROR_WRITING_FILE, METHOD_NOT_ALLOWED } = require('../configs/messages.js');
const errorHandler = require('../controllers/errorController.js');
const Busboy = require('busboy');
const successHandler = require('../controllers/successController.js');

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




const uploadVideo = async (req, res) => {


    if (req.method === 'POST') {
        if (!req.headers['content-type'].includes('multipart/form-data')) {
            return errorHandler(res, 400, INVALID_CONTENT_TYPE, { success: false, message: INVALID_CONTENT_TYPE });
        }
        try {
            busboy = Busboy({ headers: req.headers });
        } catch (error) {
            return errorHandler(res, 400, MALEFORMED_HEADERS, { success: false, message: MALEFORMED_HEADERS });
        }
        busboy.on('file', async (fieldName, fileStream, info) => {
            if (info) {
                const { filename, mimeType } = info;
                if (!mimeType.startsWith('video/')) {
                    fileStream.resume();
                    return errorHandler(res, 500, ERROR_WRITING_FILE, { success: false, message: ERROR_WRITING_FILE });
                }

                const guid = await createrBunnyVideoRecord(req, res, filename, fileStream);
                try {
                    const result = await uploadVideoBinaryToBunny(guid, fileStream);
                    successHandler(res, 200, VIDEO_UPLOADED_SUCCESSFULLY, {
                        success: true,
                        message: VIDEO_UPLOADED_SUCCESSFULLY,
                        videoId: guid
                    });

                } catch (error) {
                    return errorHandler(res, error.statusCode, FAILED_TO_UPLOAD_VIDEO, error);
                }
            }
        });
        req.pipe(busboy);

    } else {
        return errorHandler(res, 405, METHOD_NOT_ALLOWED, { success: false, message: METHOD_NOT_ALLOWED });

    }
};

module.exports = { uploadVideo };