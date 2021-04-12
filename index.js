const express = require('express');
const app = express();
const inputSite = express();

//const portApp = 3000;
const portInputSite = 3001;

/*
app.listen(portApp, () => console.log('App listening at Port ' + portApp));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));*/

inputSite.listen(portInputSite, () => console.log('InputSite listening at Port ' + portInputSite));
inputSite.use(express.static('input'));
inputSite.use(express.json({ limit: '1mb' }));


const Datastore = require('nedb');

const timings = new Datastore('./databases/timings.db');
timings.loadDatabase();

const meetings = new Datastore('./databases/meetings.db');
meetings.loadDatabase();

const persons = new Datastore('./databases/persons.db');
persons.loadDatabase();


/*
app.post('/api', (request, response) => {
    console.log('On app, Port ' + portApp + ':');
    console.log(request.body);
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    data.status = "success";
    timings.insert(data);
    response.json(data);
});

app.get('/countTimings', (req, res) => {
    console.log('New Request');
    timings.count({}, function (err, count) {
        res.json(count);
    });
});

app.get('/countMeetings', (req, res) => {
    console.log('New Request');
    meetings.count({}, function (err, count) {
        res.json(count);
    });
});

app.get('/countPersons', (req, res) => {
    console.log('New Request');
    persons.count({}, function (err, count) {
        res.json(count);
    });
});*/



inputSite.post('/send', (request, response) => {
    console.log('Send inputSite, Port ' + portInputSite + ':');
    const data = request.body;
    console.log(request);
    if (data != "") {
        if (data.timings == "") {
            console.log("No timings recieved");
        } else {
            console.log("Got timings: ");
            console.log(data);
            timings.remove({}, { multi: true }, function (err, numRemoved) {

            });
            timings.insert(data.timings);
            timings.loadDatabase();
        }

        if (data.meetings == "") {
            console.log("No meetings recieved");
        } else {
            console.log("Got meetings: ");
            console.log(data);
            meetings.remove({}, { multi: true }, function (err, numRemoved) {

            });
            meetings.insert(data.meetings);
            meetings.loadDatabase();
        }

        if (data.persons == "") {
            console.log("No persons recieved");
        } else {
            console.log("Got persons: ");
            console.log(data);
            persons.remove({}, { multi: true }, function (err, numRemoved) {

            });
            persons.insert(data.persons);
            persons.loadDatabase();
        }
    } else {
        console.log("Recieved no data.")
    }
    response.json(data);
});

inputSite.post('/recieve', (request, response) => {
    console.log('Recieve inputSite, Port ' + portInputSite + ':');
    const data = request.body;
    if (data.type == "timings") {
        timings.find({}).sort({ tStart: 1 }).exec(function (err, docs) {
            if (err) {
                console.log(err)
            } else {
                console.log("Send timings");
                response.json(docs);
            }
        });
    } else if (data.type == "meetings") {
        meetings.find({}).sort({ num: 1 }).exec(function (err, docs) {
            if (err) {
                console.log(err)
            } else {
                console.log("Send meetings");
                response.json(docs);
            }
        });
    } else if(data.type == "persons"){
        persons.find({}).exec(function (err, docs) {
            if (err) {
                console.log(err)
            } else {
                console.log("Send persons");
                response.json(docs);
            }
        });
    } else {
        response.end();
    }
});