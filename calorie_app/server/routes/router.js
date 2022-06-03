const express = require('express');


const route = express.Router();


const food_services = require('../services/food_render')

const food_controller = require('../controller/food_controller')




/// food routes
route.get('/', food_services.landing)
route.get('/user-login', food_services.login )
route.get('/user-register', food_services.register)
route.get('/food-home', food_services.food_home)
route.get('/add-food-record', food_services.add_food_record)
route.get('/update-food-record', food_services.update_food_record)
route.get('/delete-food-record',food_services.delete_food_record)
route.get('/about', food_services.about_page)
route.get('/faq', food_services.faq)

///Post Requests for users 
route.post('/user-register', food_controller.register_user)
route.post('/user-login', food_controller.validate_user)



///Food APIs
route.post('/api/food', food_controller.create);
route.get('/api/food', food_controller.find);
route.put('/api/food/:id', food_controller.update);
route.delete('/api/food/:id', food_controller.delete);


module.exports = route