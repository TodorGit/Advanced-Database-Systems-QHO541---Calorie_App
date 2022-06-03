const axios = require('axios')
var Caloriedb = require('../model/calorie_calculator');


exports.landing = (req, res)=>{
    res.render('landing')
}

exports.register = (req, res) =>{
    res.render('register', {status:" ",message: " "})
}

exports.login = (req, res) =>{

    res.render('login', {status:" ",message: " "} )
}


exports.food_home = (req, res) =>{

    axios.get('http://localhost:3000/api/food')
    .then(function(response){
       
        res.render('food_index', {food_records: response.data})
    })
    .catch(err =>{
        res.send(err);
    })

    


}

exports.add_food_record = (req, res) =>{

    res.render('add_record')
}

exports.update_food_record = (req, res) =>{


    axios.get('http://localhost:3000/api/food',{params: {id : req.query.id}})
    .then(function(food_record){
        
        res.render('update_food_record', {food: food_record.data})

    })
    .catch(err =>{
        res.send(err);
    })
    
  
}

exports.delete_food_record = (req,res) =>{

 

    Caloriedb.findByIdAndDelete(req.query.id, (err, doc)=>{
        if(!err){
            res.redirect('/food-home')
        }else{
            console.log("Failed to Delete User Details: "+ err)
        }
    })



}

exports.about_page = (req, res) =>{

    res.render('about')
}

exports.faq = (req,res) =>{

    res.render('faq')
}

