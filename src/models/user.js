const mongoose=require('mongoose');

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
        trim:true
    },
    password:{
        type:String,
        required:true,
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
    },
    about:{
        type:String,
        default:"This is default about of the user"
    },
    skills:{
        type:[String]
    },
    // createdAt:{
    //     type:Date,
    // }
},{
    timestamps:true,
});

const User=mongoose.model("User",userSchema);
module.exports=User;
 