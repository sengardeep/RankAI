import mongoose from "mongoose";

const userSchema =  new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String, 
        required:true,
        unique:true,
        tolowercase:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    plan:{
        type:String,
        enum:["free","pro"],
        default:"free"
    },
    analysisCount:{
        type:Number,
        default:0
    },
    lastAnalysisDate:{
        type:Date,
        default:null
    },
},{
    timestamps:true
})
const userModel=mongoose.model("User",userSchema);
export default userModel;