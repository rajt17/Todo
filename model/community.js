const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
    unique: true
},
owner:{
    type:[{
        id:{type:mongoose.Schema.Types.ObjectId},
        name:{type:String},
    }],
    required:true
},
users:{
    type:[{
        id:{type:mongoose.Schema.Types.ObjectId},
        name:{type:String}
    }],
    default:null
},
admins:{
    type:[{
        id:{type:mongoose.Schema.Types.ObjectId},
        name:{type:String}
    }],
},
request:{
    type:[{
        id:{type:mongoose.Schema.Types.ObjectId},
        name:{type:String},
    }],
},
permission:{
    type:String,
    required:true
},
img:{
    type:String,
    required:true
},
description:{
    type:String
}
});
const log = mongoose.model('CommLog5', UserSchema);

module.exports = log;
