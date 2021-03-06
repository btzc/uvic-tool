const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

CourseSchema = new Schema({
    '_id': ObjectId,
    'cid': String,
    'startTime': String,
    'endTime': String,
    'dates': Array,
    'name': String,
    'crn': String,
    'sectionNum': String,
    'term': String
});

mongoose.model('Course', CourseSchema);