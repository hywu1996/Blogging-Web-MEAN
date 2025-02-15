const PORT = process.env.PORT || 8080;

const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');
const authentication = require('./routes/authentication')(router);
const blogs = require('./routes/blogs')(router);
const bodyParser = require('body-parser');
const cors = require('cors');

//development
app.use(cors({
    origin: 'http://localhost:4200'
}));
//--!development--

mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
    if (err) {
        console.log('Could not connect to database: ', err);
    } else {
        console.log('Connected to database: ', config.db)
    }
});



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname+'/client/dist/client'));
app.use('/authentication', authentication);
app.use('/blogs', blogs)

app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname+'/client/dist/client/index.html'));
});

app.listen(PORT, () => {
    console.log('Listening on port ' + PORT);
});