const User = require('../models/User');
const ADMIN_LIST = require('../config/utils');
const bcrypt = require('bcrypt');

const handleRegistration = async (req, res) => {
    const { firstname, lastname, username, password } = req.body;

    //checks if a field is excluded
    if (!firstname || !lastname || !username || !password) return res.status(400).json({ message: 'firstname, lastname, username and password must be included' });

    //look for a user with a matching username
    const foundUser = await User.findOne({ username }).exec();

    if (foundUser) return res.status(400).json({ message: 'This username already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    let result;

    if (ADMIN_LIST.includes(username)) {
        result = await User.create({
            firstname,
            lastname,
            username,
            password: hashedPassword,
            roles: {
                User: 2000,
                Moderator: 2020,
                Admin: 2040
            }
        });
        console.log(result)
    }else {
        result = await User.create({
            firstname,
            lastname,
            username,
            password: hashedPassword,
            
        });
        console.log(result)
    }

    res.status(201).json(result)
};

module.exports = handleRegistration