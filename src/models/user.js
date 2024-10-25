const mongoose=require('mongoose');
const validator=require('validator');
const userSchema=new mongoose.Schema({
    firstName:{
       type:String,
       required:true,
       minlength:4,
       maxlength:80,
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email Address: "+value); 
            }
        }
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Your password is not strong : "+value); 
            }
        }
    },
    age:{
        type:Number,
        min:18,
    },
    gender:{
        type: String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender data is not valid");
            }
        },
    },
    photoUrl:{
        type:String,
        default:"https://stock.adobe.com/in/search/images?k=default+image",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid Photo URL: "+value);
            }
        }
    },
    about:{
        type:String,
        default:"This is default about of the user"
    },
    skills:{
        type:[String],
        validate(value){
          if(new Set(value).size!==value.length){
            throw new Error("skills must not contain duplicate");
          }
        }
    },
    // createdAt:{
    //     type:Date,
    // }
},{
    timestamps:true,
});

const User=mongoose.model("User",userSchema);
module.exports=User;
 