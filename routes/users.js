const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

// Connection of the mongoDB in local Database with name : StudentDatabase 
mongoose.connect("mongodb://127.0.0.1:27017/mxpertz_nodejs_task")

const userSchema = mongoose.Schema({
    username : {
        type:String,
        require: true,
        default:''
    },
    password: {
       type:String,
       require:true, 
    },
    student:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"student"
    }],
  
});

userSchema.plugin(plm);

module.exports = mongoose.model("user",userSchema);