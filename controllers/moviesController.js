const movies = require('../models/dummyData');


const getAllMovies = (req, res) => {
    return res.status(200).json({ movies })
}

module.exports = getAllMovies;