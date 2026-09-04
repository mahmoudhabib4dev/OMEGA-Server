const logger = require("../helpers/logger");
const loggerStatus = require('../helpers/loggingStatus.js');
const Busboy = require('busboy');
const path = require('path');
const fs = require('fs');
const { uploadVideo } = require('../controllers/videoController.js');

const handleUploadVideoRoute = async (req, res) => {

    if (req.method === 'POST') {

        if (!req.headers['content-type'].includes('multipart/form-data')) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ success: false, message: 'Invalid Content-Type' }));
        }

        try {
            busboy = Busboy({ headers: req.headers });
        } catch (err) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ success: false, message: 'Malformed headers' }));
        }
        busboy.on('file', async (fieldName, fileStream, info) => {
            if (info) {
                const { filename, mimeType } = info;
                if (!mimeType.startsWith('video/')) {
                    fileStream.resume();
                    res.statusCode = 500;
                    res.end(JSON.stringify({ success: false, message: 'Error writing file' }));
                }


                await uploadVideo(req, res, filename, fileStream);


            }
        });

        req.pipe(busboy);

    } else {
        res.statusCode = 405;
        return res.end(JSON.stringify({ success: false, message: 'Method Not Allowed' }));
    }
};




module.exports = { handleUploadVideoRoute };