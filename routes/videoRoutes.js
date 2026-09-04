const { uploadVideo } = require('../controllers/videoController.js');


const handleUploadVideoRoute = async (req, res) => {
    await uploadVideo(req, res);
};




module.exports = { handleUploadVideoRoute };