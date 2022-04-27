const User = require('../models/User');


const handleLogout = async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.jwt) return res.sendStatus(204);
    const refreshToken = cookie.jwt;

    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie('jwt', {httpOnly: true, sameSite: 'None'})
        return res.sendStatus(204);
    };

    const newRefreshTokenArray = foundUser.refreshToken.filter(token => token !== refreshToken);
    foundUser.refreshToken = [...newRefreshTokenArray];
    const result = await foundUser.save()
    console.log(result)

    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000})
    res.sendStatus(204)
}

module.exports = handleLogout;