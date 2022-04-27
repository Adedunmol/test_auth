const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');


const handleLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const cookie = req.cookies;

        if(!username || !password) return res.status(400).json({ message: "username and password must be included" });

        //find user
        const foundUser = await User.findOne({ username }).exec();
        if(!foundUser) return res.status(400).json({message: 'no user with this username'})

        //compare password
        const match = bcrypt.compare(password, foundUser.password);

        if (match) {

            //get codes for user roles
            roles = Object.values(foundUser.roles)
            
            //sign access token
            const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '5m' }
            )

            //sign refresh token
            const newRefreshToken = jwt.sign(
            {
                "username": foundUser.username
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
            )

            //delete the token gotten from the cookie from the database
            let newRefreshTokenArray = !cookie?.jwt ? foundUser.refreshToken : foundUser.refreshToken.filter(token => token !== cookie.jwt)
            
            //clear the cookie
            if (cookie?.jwt) { 
                
                //if user logs in, but doesn't log out and refreshToken is stolen

                //find user with token
                const refreshToken = cookie?.jwt;
                const foundToken = User.findOne({ refreshToken }).exec();
                
                //token should be there because user did not log out
                //token reuse
                if (!foundToken) {
                    newRefreshTokenArray = []
                }


                res.clearCookie('jwt', {httpOnly: true, sameSite: 'None'})
            }

            foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken]

            const result = await foundUser.save();

            res.cookie('jwt', newRefreshToken, {httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000})
       
            res.status(200).json({ accessToken })
        }
    }catch (err) {
        console.log(err)
    }
}

module.exports = handleLogin;