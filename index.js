const PORT = 8080;

const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');

mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
    if (err) {
        console.log('Could not connect to database: ', err);
    } else {
        console.log('Connected to database: ', config.db)
    }
});

const app = express();

app.use(express.static(__dirname+'/client/dist/client'));

app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname+'/client/dist/client/index.html'));
});

app.listen(PORT, () => {
    console.log('Listening on port ' + PORT);
});