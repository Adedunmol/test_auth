const jwt = require('jsonwebtoken');


const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ message: 'Bad token' });

    const token = authHeader.split(' ')[1]
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, data) => {
            if (err) return res.status(403).json({ message: "bad token" })
            req.user = data.UserInfo.username
            req.roles = data.UserInfo.roles
            next()
        }
    )
}

module.exports = verifyJWT;