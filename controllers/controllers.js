//we create functionalities here and we should export them.
//export them so as to be imported in routes.

//import db model to contolers so as we can be able to add new user to model 
const pichub =require('../models/picmodels');
//after user create account we create token for them also
const jwt = require('jsonwebtoken');

//handling errors in validation when post req.
const handleErrors=(err)=>{

  console.log(err.message, err.code);
  let errors={email:'',password:''};

  //handling incorrect email and password errors on login
if(err.message==="INCORRECT EMAIL.."){
  errors.email="THAT EMAIL IS NOT REGISTERED"
}

if(err.message==="INCORRECT PASSWORD.."){
  errors.password="THAT PASSWORD IS INCORRECT"
}
if(err.message==="PLEASE PROVIDE CREDENTIALS"){
  errors.password="PROVIDE EMAIL AND PASSWORD"
}


  //duplicate errror cide
  if(err.code===11000){
errors.email="that email is already taken / registered.";
return errors;


}

  //validation errors
  //pichub validation failed is the schema in model arraising the errors so if they includes of that schema then narrow down...
  if(err.message.includes('pichub validation failed')){

    //accessing (errors property object) and get it values using Object.values
    //we use Object.values to capture the property object values which are of email and password from the schema validation error object since it send the error as object we need to destructure so that we can get the properties we need or messages.

    //since we have an array of properties values we want we shall cycle through and destructure it so as to update error above..

    Object.values(err.errors ).forEach(({properties})=>{
    errors[properties.path]=properties.message;
    });

  }
  return errors;
}

//after user create account we create token for them also using jwt.
//id passed to be used inside the payload of the token
const maxAge= 3*24*60*60;  //valid for 3 days 
const createToken=(id)=>{

      //we use sign () to sign/create  jwt and return a token...id is payload passed as a property...gathogo is secret(shoul be secret not public)...
    return jwt.sign({id},'gathogo',{
        expiresIn:maxAge 
    })
}

 
//controllers.
//sign up to page
const signup_get =(req,res)=>{
    res.render('signup')
}

//login to page
const login_get =(req,res)=>{
    res.render('login')
}

//create new user to db
const signup_post = async(req,res)=>{
    const {email,password}=req.body;
    try{
        //create to add what we capture from req body to our db 
          const user = await pichub.create({email,password});
          //create token after user sign in
          const token=createToken(user._id);
          //putting the token above into a cookie by creating cookie
          res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000})
          res.status(201).json({user: user._id });
    }

    //it is good to send a json handling error string to user if their is if not validated....error as set in the database..(in picmodels db)
    catch (err) {

       const errors= handleErrors(err)
        //console.log(err)
        res.status(400).json({errors})   //errors is an object property shouldbe in {} to be destructured..
        //status(400).json({ error: error.message })
    }

}

//authenticate current user
const login_post =async(req,res)=>{
    const{email,password}=req.body
    try {
      if(!email || !password){
        throw Error ("PLEASE PROVIDE CREDENTIALS")
      }
      const user = await pichub.findOne({email})
      if(!user){
        throw Error("INCORRECT EMAIL..")
      }
      const isPasswordCorrect = await user.comparePassword(password)
      if(!isPasswordCorrect){
        throw Error("INCORRECT PASSWORD..")
      }
      const token = createToken(user._id);
      res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
      res.status(200).json({user:user._id})
      console.log(user)
      
    } catch (err) {
      const errors= handleErrors(err)
      res.status(400).json({errors})
      
    }
   

}

//to logout  we need to delete (jwt and cookie) by replacing it with blank/empty string and a very short expiry date...
//the jwt token will be replaced with what we pass. 
const logout_get = (req,res)=>{
//when we click logout the current cookie will be replaced by this cookie below with a very short time and by so if we want to log in back then we need to verify ourselfby login in.

//by doing this we remove the token value created before by a blank string 
  res.cookie('jwt' ,'' ,{maxAge:1})
  res.redirect('/');

}

//we create functionalities here and we should export them.
module.exports={signup_get,login_get, signup_post,login_post,logout_get}






// try{
//   const user= await pichub.login(email,password);
//    //create token after user sign in
//    const token=createToken(user._id);
//    //putting the token above into a cookie by creating cookie
//    res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
//   res.status(200).json({user:user._id})
//   console.log(user)

// }
// catch(err){
//   const errors= handleErrors(err)
// res.status(400).json({errors})
// }