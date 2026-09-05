const uploadImage = require('../controllers/imageController.js');


const handleUploadImageRoute = async (req, res) => {
    await uploadImage(req, res);
};


module.exports = handleUploadImageRoute;