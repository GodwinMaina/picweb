const { lowerCase } = require('lodash');
const mongoose =require('mongoose');

//validator
const {isEmail} = require('validator');
//hashing password using bcrypt
const bcrypt = require('bcrypt');
//SALT_WORK_FACTOR= (10);

const picSchema = new mongoose.Schema({

    email:{
        type:String,
        required:[true,'please Enter an Email.'],
        unique:true,  //to ensure no other user with same email exist.
        lowerCase:true, //to ensure the email is in lower case.
        validate:[isEmail,'Please Enter a valid Email..']
    },
    password:{
        type:String,
        required:[true,'Please Enter Password..'],
        minlength:[6,'minimum Password length is 6 characters.. '] //not less than six characters.
    }
});

//hashing password.
//mongoose hooks. 
//we use schema name.(mongoose hook to be used)
//using pre() hook to hash password using bcrypt.
picSchema.pre('save', async function(next){
  // generate salt first and atach it to password before hashing.
  const salt = await bcrypt.genSalt(10);
  //this refers to instance of user you trying to create.
  this.password = await bcrypt.hash(this.password,salt);
  //next middleware enable us to go next step after pre which hash
  next ();
});


//static method t0 login in user
//we are comparing user details and with those in database and if there is errors we throw.


picSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch;
}




//create a model based on the schema above
const pichub = mongoose.model('pichub',picSchema);
module.exports=pichub;




// picSchema.statics.login = async function(email,password){
//     const user = await this.findOne({email});
//     if(user){
//         const auth = await bcrypt.compare(password,user.password);
//         if(auth){
//             return user;
//         }
//         throw Error('INCORRECT PASSWORD..')
//     }
//   throw Error('INCORRECT EMAIL..')
// }