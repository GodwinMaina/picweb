const express= require('express');

const router= express.Router();  //const {Router}=require('express');

//you must export this routes to the express app or server.
//routes ease our work and help to make or code cleaner.

//import controllers here so as to use the functionallities in the routes..

const {signup_get,login_get, signup_post,login_post,logout_get} = require('../controllers/controllers');
//const controllers = require('../controllers/controllers');

// signup to page
router.get('/signup',signup_get);        //router.get('/signup',controllers.signup_get);  

//login to page
router.get('/login',login_get);          //router.get('/signup',controllers.login_get);

//create new user to db
router.post('/signup',signup_post);

//authenticate current/existing user
router.post('/login',login_post);

//router to log out 
router.get('/logout',logout_get);

module.exports=router;

