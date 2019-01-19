const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    img:{
        type : String,
    },
  name:{
      type:String,
  },
  gender:{
      type:String,
  },
  dob:{
      type:String,
  },
  email:{
    type: String,
    required: true,
    unique: true
},
phone:{
    type: String,
    required: true,
    minlength:[10,'Too few'],
    maxlength:[10,'too many'],
},
city:{
    type: String,
    required: true
},
interest:{
    type:String,
    maxlength:[100,'Dont Exceed 100 characters']
},
journey:{
    type:String,
    maxlength:[200,'Dont exceed 200 characters']
},
password:{
    type: String,
    minlength:[6,'Too Short'],
    required: true
},
expectations:{
    type:String,
    maxlength:[200,'Dont exceed 200 characters']
},
status:{
    type:String,
    default:'Pending'
},
roleoptions:{
    type:String
}
});

const log = mongoose.model('log2', UserSchema);

module.exports = log;
