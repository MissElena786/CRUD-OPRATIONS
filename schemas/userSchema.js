const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    mobile :{
        type : String,
        required : true,
        unique : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password :{
        type : String,
        required : true
    },
    token : {
        type: String,
        default  :""
    },
    profile_pic : {
        type: String,
        default : null
    }
    
})


const user  = mongoose.model("user", userSchema)

module.exports = user;