const jwt = require('jsonwebtoken');
const { error } = require('../utils/responseWrapper');
const User = require('../models/User');


 module.exports = async (req, res, next) => {
    console.log('Request Headers from requireUser.js:', req.headers);
    if(!req.headers || !req.headers.authorization ||!req.headers.authorization.startsWith("Bearer")) {
        // return res.status(401).send("Authorization header is required");
        console.log('Authorization header is missing or incorrectly formatted');
        return res.send(error(401, 'Authorization header is required'));
    }
    console.log('Authorization header:', req.headers.authorization);
    
    const accessToken = req.headers.authorization.split(" ")[1];
    console.log('Extracted accessToken from requireUser.js:', accessToken);

    try{
        console.log('JWT Secret Key:', process.env.ACCESS_TOKEN_PRIVATE_KEY);
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_PRIVATE_KEY);
        console.log('Decoded token:', decoded);

        req._id = decoded._id;

        const user = await User.findById(req._id);
        if(!user) {
            console.log('User not found for ID from requireUser.js', req._id);
            return res.send(error(404, 'User not found'));
        }

        next();

    } catch(e) {
        console.log('JWT verification error from requireUser.js:', e.message);
        // return res.status(401).send("Invalid access key");
        // return res.status(401).send("Invalid access key");
        return res.send(error(401, 'Invalid access key'));

    }

};