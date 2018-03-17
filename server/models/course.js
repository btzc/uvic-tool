const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectID = Schema.ObjectID;

CourseSchema = new Schema({
    '_id': ObjectID,
    'cid': String,
    'time': String,
    'dates': Array,
    'name': String,
    'crn': String,
    'sectionNum': String,
    'term': String
});

mongoose.model('Course', CourseSchema);