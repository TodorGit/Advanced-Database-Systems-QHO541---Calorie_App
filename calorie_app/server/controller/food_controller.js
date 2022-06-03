const { rawListeners } = require('../model/calorie_calculator');
var Caloriedb = require('../model/calorie_calculator');
const User = require('../model/users');
const bcrypt = require('bcrypt')


///create and save food entry

exports.create = (req, res)=>{

    //validate request 
    if(!req.body){

        res.status(400).send({message: "Content cannot be empty" });
        return;
    }

    /// new food_record
    const food_record = new Caloriedb({

        food_name: req.body.food_name,
        food_weight: req.body.food_weight,
        calories_hundred: req.body.calories_hundred,
        calories: (req.body.food_weight * req.body.calories_hundred)/100

    })

    /// save food_record in the database

    food_record
        .save(food_record)
        .then(data =>{
            //res.send(data)
            res.redirect('/add-food-record');
        })
        .catch(err =>{
            res.status(500).send({
                message: err.message || "Some Error occurred while creating operation"
            })
        })



}
// retrieve and return all the food records
exports.find = (req, res) =>{

    if(req.query.id){
        
        const id = req.query.id;

        Caloriedb.findById(id)
        .then(data => {
            
            if(!data){
                res.status(404).send({message: "Not found user with id="+id})
            }else{
                res.send(data)
            }

        }).catch(err =>{
            res.status(500).send({message: 'Error retrieving user with id '+ id})
        })


    }

    else{

    Caloriedb.find()
    .then(users =>{
        res.send(users)
    })
    .catch(err =>{

        res.status(500).send({message: err.message || 'Error Occured while retrieving users information' })

    })

}


}

///Update a food record

exports.update = (req, res)=>{

    if(!req.body){
        return res 
        .status(400)
        .send({message: "Data to update can not be empty"})
    }
    const id = req.params.id;

    Caloriedb.findByIdAndUpdate(id, req.body, {
        useFindAndModify: false})
    .then(data =>{
        if(!data){
            res.status(400).send({message : `Failure to update user with id ${id}. User not found!` })
        }else{

            const calories = (data.food_weight* data.calories_hundred)/100;
            [
                {"$set" : {"data.calories": calories}}
            ]
           
            res.send(data)
    
            
            
        }
    })
    .catch(err => {
        res.status(500).send({message: "Error Updating user information"})
    })



}

/// Delete a food record with specified id

exports.delete = (req, res)=>{

    const id = req.params.id;
    
    Caloriedb.findByIdAndDelete(id)
    .then(data =>{
        if(!data){
            res.status(404).send({message: `Cannot Delete record with id ${id}. The ID could be wrong.`})
        }
        else{
            res.send({
                message: "User was deleted successfully!"
            })
        }

    })
    .catch(err=>{
        res.status(500).send({message: "Could not delete user with Id= " +id });
    });


}

exports.register_user = (req, res) =>{

    let{fname, lname, email, password } = req.body;
    fname = fname.trim();
    lname = lname.trim();
    email = email.trim();
    password = password.trim();

    

    if(fname==""|| lname=="" ||email=="" || password==""){

        res.render("register", {status:"FAILED", message: "Empty input fields!"})

    }else if(!/^[a-zA-Z]*$/.test(fname)){
        res.render("register", {status:"FAILED", message: "Invalid first name entered"})

        }else if(!/^[a-zA-Z]*$/.test(lname)){
            res.render("register", {status:"FAILED", message: "Invalid last name entered"})

        }else if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
            res.render("register", {status:"FAILED", message: "Invalid email entered"})

        }else if(password.length < 8){
            res.render("register", {status:"FAILED", message: "Password is too short"})

           }else{
            /// Checking if the user already exists
            User.find({email: email}).then(result =>{
                if(result.length){

                    res.render("register", {status:"FAILED", message: "User with the provided email already exists "})
    
                }else{
                    const saltRounds = 10;
                    bcrypt.hash(password, saltRounds).then(hashedPassword =>{

                        const newUser = new User({
                            fname, 
                            lname,
                            email,
                            password:hashedPassword
                        })

                        newUser.save().then(result =>{

                            const message = "User saved Successfully"
                            res.render('register', {status:"SUCCESS",message: message})
                        }).catch(err =>{

                            res.render('register', {status:"FAILED",message: "An error occured while saving user account"})

                        })

                    }).catch(err =>{

                        res.render('register', {status:"FAILED",message: "An error occurred while hashing password!"})
                    
                    })
                }
                
            }).catch(err=>{
                console.log(err);
                res.render('register', {status:"FAILED",message: "An error occured while checking for existing user!"})
        
            })


            }
    

}


// exports.register_user = (req, res)=>{

//     const user_record = new User({

//         fname: req.body.fname,
//         lname: req.body.lname,
//         email: req.body.email,
//         password: req.body.password
//     })

//     user_record
//     .save(user_record)
//     .then(data =>{

//         res.render('login', {message: "Please log into the account"})
       
       
//     })
//     .catch(err =>{
//         res.status(500).send({
//             message: err.message || "Some Error occurred while creating operation"
//         })
//     })

// }

// exports.validate_user = (req, res)=>{

//     const email = req.body.email;
//     const password = req.body.password;
//     const fname = req.body.fname;

//     User.findOne({email: email}, (err, foundResults) =>{

//         if(err){
//             console.log(err);
//         }else{

//             console.log(foundResults)
//             if(foundResults.password === password){

//                 res.redirect('/food-home')
//             }
//             else{
//                 console.log(`Invalid credentials ${password}`)
//                 res.redirect('/user-login')
//             }
//         }

//     })

// }
exports.validate_user = (req, res) =>{

    let{email, password } = req.body;
    email = email.trim();
    password = password.trim();

    if(email=="" || password==""){

        res.render('login', {status:"FAILED", message:"Empty Credentials Supplied"})
    }else{
        User.find({email}).then(data => {
            if(data){
                //User Exists

                const hashedPassword = data[0].password;
                bcrypt.compare(password, hashedPassword).then(result =>{

                    res.redirect('/food-home')
                }).catch(err=>{

                    res.render('login', {status:"FAILED", message:"An error occurred while comparing passwords"})
                })

            } else{
                res.render('login', {status:"FAILED", message:"Invalid email or password entered!!"})
            }
        }).catch(err=>{

            res.render('login', {status:"FAILED", message:"An error occurred while checking for existing user"})
        })
    }


}

