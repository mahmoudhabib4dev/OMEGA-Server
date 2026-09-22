const crypto = require("crypto");
const bcrypt = require('bcryptjs');

const otpGenerator = async () => {

    const otp = crypto.randomInt(100000, 999999);
    const salt = await bcrypt.genSalt(10);
    const otp_hash = await bcrypt.hash(otp.toString(), salt);

    return {otp_hash , otp};
};


module.exports = otpGenerator;