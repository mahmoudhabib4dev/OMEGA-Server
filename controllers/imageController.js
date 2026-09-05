const Busboy = require('busboy');
const errorHandler = require('./errorController.js');
const successHandler = require('./successController.js');
const {
    FAILED_TO_UPLOAD_IMAGE,
    METHOD_NOT_ALLOWED,
    INVALID_CONTENT_TYPE,
    INVALID_FILE_TYPE,
    ONLY_IMAGES_ALLOWED,
    IMAGE_UPLOADED_SUCCESSFULLY
} = require('../configs/messages.js');


const uploadImageToBunnyCDN = async (fileName, fileStream) => {
    const storageName = process.env.BUNNY_STORAGE_NAME;
    const apiKey = process.env.BUNNY_STORAGE_KEY;
    const url = `${process.env.BUNNY_IMAGE_STORAGE_LIBRARY}${storageName}/images/${Date.now()}_${fileName}`;
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'AccessKey': apiKey,
            'Content-Type': 'application/octet-stream'
        },
        duplex: 'half',
        body: fileStream
    });

    if (!response.ok) {

        return errorHandler(res, 400, FAILED_TO_UPLOAD_IMAGE, { success: false, message: FAILED_TO_UPLOAD_IMAGE });
    }

    return await response.json();
};


const uploadImage = async (req, res) => {
    if (req.method !== 'POST') {
        return errorHandler(res, 405, METHOD_NOT_ALLOWED, { success: false, message: METHOD_NOT_ALLOWED });
    }

    if (!req.headers['content-type'].includes('multipart/form-data')) {
        return errorHandler(res, 400, INVALID_CONTENT_TYPE, { success: false, message: INVALID_CONTENT_TYPE });
    }
    try {
        const busboy = Busboy({ headers: req.headers });
        busboy.on('file', async (fieldName, fileStream, info) => {
            const { filename, mimeType } = info;

            // Validate image MIME type
            if (!mimeType.startsWith('image/')) {
                fileStream.resume(); // Drain the stream to release memory
                return errorHandler(res, 400, INVALID_FILE_TYPE, { success: false, message: ONLY_IMAGES_ALLOWED });
            }

            try {
                const result = await uploadImageToBunnyCDN(filename, fileStream);
                return successHandler(res, 200, IMAGE_UPLOADED_SUCCESSFULLY, {
                    success: true,
                    message: IMAGE_UPLOADED_SUCCESSFULLY,
                    data: result
                });
            } catch (error) {
                return errorHandler(res, 500, error.message, { success: false, message: error.message });
            }
        });

        req.pipe(busboy);
    } catch (err) {
        return errorHandler(res, 400, MALEFORMED_HEADERS, { success: false, message: MALEFORMED_HEADERS });
    }
};



module.exports = uploadImage;