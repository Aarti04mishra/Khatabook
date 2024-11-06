const mongoose = require('mongoose');

// Make sure the connection string is properly formatted
mongoose.connect('mongodb+srv://aartimishra:asdfrgthyfrgxdef@cluster0.t5pow.mongodb.net/mykhatabook?retryWrites=true&w=majority')
    .then(function() {
        console.log("Connected to MongoDB");
    })
    .catch(function(error) {
        console.log("Error connecting to MongoDB: ", error);
    });

let db = mongoose.connection;

module.exports = db;
