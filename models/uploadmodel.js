const mongoose = require('mongoose');
const { string } = require('sharp/lib/is');
const { buffer } = require('stream/consumers');

const uploadSchema = new mongoose.Schema(
    {

        image:{

            data:Buffer,
            contentType:String,
        

        },

        caption:{
            type:String,
            required:true

        },
        
        memories:{
            type:String,
            required:true
        }

    });
    
    const Image = mongoose.model('Image', uploadSchema);
    module.exports = Image;








