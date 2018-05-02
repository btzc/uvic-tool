const jQuery = require('cheerio');
const async = require('async');
const request = require('request');
require('../server/models/Course');
const mongoose = require('mongoose');
ObjectID = mongoose.ObjectID;

// Connection URL
const url = 'mongodb://localhost:27017/uvic-tool';

const db = mongoose.createConnection(url);

// model
const Course = db.model('Course');

// parse subject string into json objects
let parseSubjects = function( string ){
    let subjects = [];
    jQuery(string).each(function(index, course) {
        subjects.push(course.attribs.value);
    });
    return subjects;
};

// parse list of courses into json object
let parseCourses = function (courseObject, term, subjectArray) {
    let string = courseObject.courseStringData;
    let courses = jQuery(string).find('.ddtitle');
    jQuery(courses).each(function (index) {
        let subjectObject = {};
        let course = courses[index];
        let parent = jQuery(course).closest('tr');
        let table = jQuery(parent).next().find('.datadisplaytable').find('.dddefault');
        if (table.length > 6) {
            let time = jQuery(table)[1].children[0].data;
            let dates = jQuery(table)[2].children[0].data;
            let datesArr = dates.split('');
            if(time) {
                let splitTime = time.trim().split('-');
                subjectObject.startTime = splitTime[0];
                subjectObject.endTime = splitTime[1];
            } else {
                subjectObject.time = time;
                subjectObject.dates = datesArr;
            }
        }
        let information = jQuery(course).children().text();
        let split = information.split(' - ');
        if (split.length === 5) {
            subjectObject.name = split[0] + ' ' + split[1];
            subjectObject.crn = split[2];
            subjectObject.abbrev = split[3];
            subjectObject.sectionNum = split[4];
        }
        else {
            subjectObject.name = split[0];
            subjectObject.crn = split[1];
            subjectObject.abbrev = split[2];
            subjectObject.sectionNum = split[3];
        }
        subjectObject.cid = subjectObject.abbrev.replace(/ /g, '');
        subjectObject.term = term;
        subjectArray.push(subjectObject);
    });
    return subjectArray;
};

// remove all duplicates
let uniqueSubject = function( subjectObject ) {
    let uniqueList = [];
    for( let i = 0; i < subjectObject.length; i++ ) {
        let item = subjectObject[i].abbrev;
        if( !uniqueList.includes(item) ) {
            uniqueList.push(item);
        }
    }
    return uniqueList;
};

// get data from uvic website calls
let getData = function () {
    // summer: year + 05
    // fall: year + 09
    // spring: year + 01
    let term = '201805';
    let url = 'https://www.uvic.ca/BAN1P/bwckgens.p_proc_term_date';
    let headers = {
        'Content-type': 'application/x-www-form-urlencoded'
    };
    let form = {
        'p_calling_proc': 'bwckschd.p_disp_dyn_sched',
        'p_term': term
    };
    let options = {
        url: url,
        method: 'POST',
        headers: headers,
        form: form
    };
    // select term
    request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            let courses = jQuery(body).find('#subj_id').children();
            let subjects = parseSubjects(courses);

            url = 'https://www.uvic.ca/BAN1P/bwckschd.p_get_crse_unsec';

            let subjectData = [];

            // retrieve all data for all courses given a term and a subject
            async.each(subjects,
                function (subject, callback) {
                    let data = 'term_in=' + term + '&sel_subj=dummy&sel_day=dummy&sel_schd=dummy&sel_insm=dummy&sel_camp=dummy&sel_levl=dummy&sel_sess=dummy&sel_instr=dummy&sel_ptrm=dummy&sel_attr=dummy&sel_subj=' + subject + '&sel_crse=&sel_title=&sel_schd=%25&sel_insm=%25&sel_from_cred=&sel_to_cred=&sel_camp=%25&sel_levl=%25&sel_ptrm=%25&sel_instr=%25&begin_hh=0&begin_mi=0&begin_ap=a&end_hh=0&end_mi=0&end_ap=a';
                    options = {
                        url: url,
                        method: 'POST',
                        headers: headers,
                        form: data
                    };
                    let course = {};
                    request(options, function requestCallback(err, res, b) {
                        if (!err && res.statusCode === 200) {
                            course.subject = subject;
                            course.courseStringData = b;
                            subjectData.push(course);
                            callback();
                        }
                        else if (err) {
                            callback(err);
                        }
                        else {
                            callback('error: status code ' + res.statusCode);
                        }
                    });
                },
                // parse the data
                function (err) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        let subjectParsedData = [];
                        for (let i = 0; i < subjectData.length; i++) {
                            parseCourses(subjectData[i], term, subjectParsedData);
                        }
                        let subjectList = uniqueSubject(subjectParsedData);
                        let termSubjects = [];
                        // put into an array and assert course model
                        for (let n = 0; n < subjectParsedData.length; n++) {
                            termSubjects.push(new Course({
                                _id: ObjectID,
                                "cid": subjectParsedData[n].cid,
                                "startTime": subjectParsedData[n].startTime,
                                "endTime": subjectParsedData[n].endTime,
                                "dates": subjectParsedData[n].dates,
                                "name": subjectParsedData[n].name,
                                "crn": subjectParsedData[n].crn,
                                "abbrev": subjectParsedData[n].abbrev,
                                "sectionNum": subjectParsedData[n].sectionNum,
                                "term": subjectParsedData[n].term
                            }));
                        }
                        // write to database
                        Course.insertMany(termSubjects, function (err, doc) {
                            if (err) {
                                res.send("Couldn't add to database");
                            }
                            else {
                                mongoose.disconnect();
                                return ;                          
                            }
                        });
                    }
                    return ; 
                });
            return; 
        }
    });
    return; 
}

getData();