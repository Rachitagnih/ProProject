const express = require('express');
const app = express();
const port = 5000;
const mongoose = require('mongoose');
const {MONGOURI} = require('./keys.js');

mongoose.connect(MONGOURI);
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});
mongoose.connection.on('error', () => {
    console.log('Error connecting to MongoDB');
});

require('./models/user.js');
require('./models/post.js');

app.use(express.json());
app.use(require('./routes/auth.js'));
app.use(require('./routes/post.js'));



app.listen(port, ()=>{
    console.log('Server is running on port : '+ port);
})










// C:\Program Files\MongoDB\Server\7.0\data\
//V7mYJ47hI5JRgt3s
//IP : 47.9.130.187/32