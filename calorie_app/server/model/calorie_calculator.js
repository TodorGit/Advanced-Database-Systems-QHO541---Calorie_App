const mongoose = require('mongoose');

var schema = new mongoose.Schema({

    food_name: {
        type: String,
        required: true 
    },
    food_weight: {
        type: Number,
        required: true,
    },
    calories_hundred: {
        type: Number,
        required: true},
    calories: {
        type: Number,
        

    }
    
})

const Caloriedb = mongoose.model('caloriedb', schema);

module.exports = Caloriedb;