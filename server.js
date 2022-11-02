const express = require('express');
const nodemailer = require('nodemailer');
const { appendFile } = require('fs');
const mongoose = require('mongoose');
//cookie-parser to pass cookie data
const cookieParser = require('cookie-parser');
const os = require('os');

const Image = require('./models/uploadmodel');

const fs = require('fs');
const path = require('path');
const multer = require('multer');

//set up multer for storing uploaded files
const storage = multer.diskStorage({
  destination:function(req,file,cb){
    //cb is callback
    cb(null , './uploads' );
  },
  filename:function(req,file,cb){
    cb(null, new Date().toISOString()+file.originalname)
  }
})

//you can also filter a file eg not upload zipped file etc only jpeg
const upload = multer({storage:storage});




const user ={

    release:os.release(),
    name:os.type(),
    freemem:os.freemem(),
    totalmeme:os.totalmem(),
    time:(os.uptime()/3600)


}
 console.log(user)
const server=express();

//set view engine
server.set('view engine','ejs');
//middleware
server.use(express.static('/public'));
server.use('/imgs',express.static('./imgs'));
server.use(express.json());
server.use(cookieParser());

//import routes
const routes=require('./routes/routes');
const { requireAuth, checkUser } = require('./middleware/authmiddleware');
//to use routes we need to use .use....you can also provide a specific path so as to acess the routes

//listening to port


//connecting to db
/*
mongoose.connect('mongodb+srv://profarm:profarm@profarm.qyjxe80.mongodb.net/picdb?retryWrites=true&w=majority')
 .then((result)=>server.listen(5000))
 .catch((error)=>console.log("error in connecting to db"));

*/

//connection to mongo db locally.
mongoose.connect('mongodb://127.0.0.1/picdb')
mongoose.connection.once('open',()=>{
    console.log('connected')
    server.listen(5000);
});

//to apply to every route use '*' then pass the functionallity.
//NB all routes to be rendered should be below this line to avoid errors in passing locals like variables...
server.get('*',checkUser);


//routes
server.get('/',(req,res)=> res.render('Home'));

server.get('/pics',requireAuth, (req,res)=>res.render('pics'));

server.get('/about',(req,res)=>res.render('about'));

server.get('/upload',requireAuth,(req,res)=>res.render('upload'));


//post image to db or upload to db
server.post('/upload',upload.single('image'),(req,res,next)=>{

console.log(req.file)
const obj= new Image({

  image:req.body.image,
  caption:req.body.caption,
  memories:req.body.memories
});
obj.save() 
.then (result=>{
  console.log(result);
  res.status(201).json({
    message:"created product succesfully"
  })
})

});

/*
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'goddymaina6@gmail.com',
    pass: '7359mainaxo'
  }
});

const mailOptions = {
  from: 'goddymaina6@gmail.com',
  to: 'godwingathogo91@gmail.com',
  subject: 'Sending Email using Node.js Welcome!!!',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

*/


//transport configuration for user a site server to send an email.
const transporter = nodemailer.createTransport({
    // This is the SMTP mail server to use for notifications. 
    // GCDS uses this mail server as a relay host.
    pool:'true',
    host: "smtp.gmail.com",
    // SMTP is unlike most network protocols, which only have a single port number. 
    // SMTP has at least 3. They are port numbers 25, 587, and 465.
    // Port 25 is still widely used as a **relay** port from one server to another.
    // Port for SSL: 465
    // Port for TLS/STARTTLS: 587
    port: 465,
    //  if true the connection will use TLS when connecting to server. If false (the 
    // default) then TLS is used if server supports the STARTTLS extension. In most 
    // cases set this value to true if you are connecting to port 465. For port 587 or 
    // 25 keep it false
    secure: true, // use TLS
    auth: {

      type:'oauth2',
        // Your full email address
        user:'opop@gmail.com',
        // Your Gmail password or App Password
        pass: '..errror404@'
    }
  });

  const mailOptions = {
    from: 'opop@gmail.com',
    to: 'g1@gmail.com',
    subject: 'Sending Email using Node.js Welcome!!!',
    text: 'That was easy!'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  

server.use(routes);




/*
"use strict";
const nodemailer = require("nodemailer");
const { result } = require('lodash');

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"godwingathogo91@gmail.com>', // sender address
    to: "goddymaina6@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);
*/
