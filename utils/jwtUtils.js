const jwt = require("jsonwebtoken");

const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, 
    process.env.ACCESS_TOKEN_SECRET, //gneerated the access tooken secret which is stored in my .env
    { expiresIn: "15m"})
};

const generateRefreshToken = (userId) => {
    return jwt.sign({ userId },
        process.env.REFRESH_TOKEN_SECRET, //generated and stored in the .env. - node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
        { expiresIn: "7d"})
};

module.exports = { generateAccessToken, generateRefreshToken };