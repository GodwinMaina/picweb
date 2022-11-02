//middleware to protect routesfrom unauthonticated users..
//you must login 
//we need to validate our jwt we created

//validate 
const jwt = require('jsonwebtoken');
const pichub = require('../models/picmodels');

//middleware function
//middleware we always have next object method
const requireAuth = (req,res,next)=>{

//grabbing token from cookies in browser called jwt it checks if current token exist

    const token =req.cookies.jwt;

    //check if json web token exists and is verified..

    if(token){
        //veryfying token using verify method..
        // 'gathogo' is the secret key we used in signing the token in the contollers

        jwt.verify(token,'gathogo',(err,decodedToken)=>{
            //if you have token but invalid still redirect..
            if(err){
                console.log(err.message);
                next();
            }
            else{
                console.log(decodedToken)
                next();
            }

        });

    }

    //if you dont have token redirect
     else{
        res.redirect('/login')
     }
    }


     //check current user
     const checkUser=(req,res,next)=>{

        const token =req.cookies.jwt;

        if(token){
       // first get token from cookies and check if it actually exists...verify token..
       jwt.verify(token,'gathogo',async(err,decodedToken)=>{          //decoded token is the decoded value of token to cookie it is the payload having id which we can use to get current user.
        //if you have token but invalid still redirect..
        if(err){
            console.log(err.message);  //if token not verified  console error
            //this is to deny viewing ofuser by setting to null if notlogged in
            res.locals.user=null;
            next();
        
        }
        else{
            console.log(decodedToken)  //decodedtoken has the id of the user.
            const user = await pichub.findById(decodedToken.id);
            //now to inject this user to our view using res we need to use locals.(whatever property or var we need into our views) to our res and say
            res.locals.user=user;
            next();
          }
      })
   }
         //if token doesnt exist set user to null
         else{
            res.locals.user=null;
            next();
     }
 }
       

module.exports ={requireAuth,checkUser};