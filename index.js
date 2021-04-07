const express = require('express');
const app = express();

app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));

const Datastore = require('nedb');

const database = new Datastore('database.db');
database.loadDatabase();

app.post('/api', (request, response) => {
    console.log(request);
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    data.status = "success";
    database.insert(data);
    response.json(data);
});
