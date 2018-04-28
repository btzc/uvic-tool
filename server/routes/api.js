const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Course');

// Database url
const url = 'mongodb://localhost:27017/uvic-tool';
mongoose.connect(url);

// Connect to Mongo
const db = mongoose.connection;

// Models
const Course = db.model('Course');

// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

router.get('/all', (req, res) => {   
    Course.find()
        .then((courses) => {
            console.log(courses);
            response.data = courses;
            res.json(response);
        })
        .catch((err) => {
            sendError(err, res);
        });
});

module.exports = router;