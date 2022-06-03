const mongoose = require('mongoose')


var users_schema = new mongoose.Schema({

    fname: {type: String,
    required: true},
    lname: {type: String,
    required: true}, 
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});
// //bcrypt middleware



const User = new mongoose.model("User", users_schema);

module.exports = User;