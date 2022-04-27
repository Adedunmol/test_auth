const jwt = require('jsonwebtoken');
const User = require('../models/User');


const getNewRefreshToken = async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.jwt) return res.status(403).json({ message: 'no cookie' });
    const refreshToken = cookie.jwt;
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None'});

    const foundUser = await User.findOne({ refreshToken }).exec();
    console.log(foundUser)
    
    //reuse detected
    if (!foundUser) {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, data) => {
                if (err) return res.status(403).json({ message: 'token expired or bad token at reuse' });
                const user = await User.findOne({ username: data.username }).exec();
                user.refreshToken = [];
                const result = await user.save();
            }
        )
    }

    const newRefreshTokenArray = foundUser.refreshToken.filter(token => token !== refreshToken);

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, data) => {
            roles = Object.values(foundUser.roles);

            if (err) {
                foundUser.refreshToken = [...newRefreshTokenArray];
                const result = await foundUser.save();
            }
            if (err || foundUser.username !== data.username) return res.status(403).json({ message: 'token expired or bad token' });
            const accessToken = jwt.sign(
                {
                    "UserInfo" : {
                        "username": foundUser.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '5m' }
            );

            const newRefreshToken = jwt.sign(
                {"username": foundUser.username},    
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );

            foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];

            const result = foundUser.save()

            res.cookie('jwt', newRefreshToken, {httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000})
            
            res.status(200).json({ accessToken })
        }
    )
}

module.exports = getNewRefreshToken