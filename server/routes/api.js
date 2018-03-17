const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Database url
const url = 'mongodb://localhost:27017/uvic-tool';
mongoose.connect(url);

// Connect to Mongo
const db = mongoose.connection;

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

module.exports = router;