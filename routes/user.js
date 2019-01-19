const express=require('express');
router=express.Router();
const passport=require('passport');
const bcrypt=require('bcryptjs');
const {check}=require('express-validator/check');
const multer=require('multer');

var User=require('../model/schema');
var Community=require('../model/community');
const upload=require('../config/multer');
const fetchUser=require('../config/fetchUser');
var ensureAuthenticated=require('../config/auth');



router.get('/',(req,res) => res.render('home'));

/*router.get('/profile', ensureAuthenticated, (req, res) =>{
  res.render('profile', {
    logger: req.user
  });
});*/

router.get('/addInfo',(req,res)=> {
  res.render('addInfo',{
  logger:req.user
});
});

router.get('/profile/searchComm',(req,res)=> {
  id=req.user.id;
  Community.find({}).then(communities=>{
    res.render('searchComm',{
      logger:req.user,
      comms:communities
  }); 
});
});

router.get('/profile/joinComm',(req,res)=>{
  var cname=req.query.name;
  var id=req.user.id;
  var name=req.user.name;
  console.log(name);
  Community.findOne({name:cname}).then(comm=>{
    console.log(comm.name);
    if(comm.permission != 'D')
    {
      comm.request.push({id,name});
      comm.save();
    }
    else
    { 
      comm.users.push({id,name});
      comm.save();
    }
    res.redirect('/profile/commHome');
    console.log(comm.users[0]);
  });
});

router.get('/profile/demo',(req,res)=>res.render('demo',{logger:req.user}));

router.get('/profile/commList',(req,res)=>{
  Community.find({}).then(comms=>{
    res.render('commList',{
      comms,
      logger:req.user
  }); 
});
});

router.post('/addInfo',(req,res)=>{
  const{name,dob,gender,phone,city,journey,expectations}=req.body;
  req.user.name=name;
  req.user.dob=dob;
  req.user.phone=phone,
  req.user.gender=gender;
  req.user.city=city;
  req.user.journey=journey;
  req.user.expectations=expectations;
  req.user.status='Confirmed';
  req.user.save().then(user=>{
    console.log(user);
    res.redirect('/profile')
  })
})


router.post('/updateProfilePic',(req,res)=>{
  upload(req, res, (err) => {
    if(err){
      console.log(err);
      res.render('addInfo', {
        msg: err,
        logger:req.user
      });
    } else {
      if(req.file == undefined){
        res.render('addInfo', {
          msg: 'Error: No File Selected!',
          logger:req.user
        });
      } else {
        req.user.img=req.file.filename;
        req.user.save().then(user=>{
        });
        res.render('addInfo', {
          msg: 'File Uploaded!',
          logger:req.user
        });
      }
    }
  });
})

router.get('/profile/commHome',(req,res) =>{
  var user=req.user;
  Community.find({}).then(communities=>{
    res.render('commHome',{
     user,
     communities,
     logger:req.user
   });
  });
});


router.get('/profile/commHome/commProfile',(req,res)=> res.render('commProfile'));

router.get('/profile/commHome/showComm',(req,res)=>{
  var id=req.query.id;
  Community.findById({_id:id}).then(comm=>{
    res.render('commProfile',{
      logger:req.user,
      comm
    });
  });
  
});

router.get('/profile/commHome/manageComm',(req,res)=>{
  var id=req.query.id;
  var flag=true;
  Community.findById({_id:id}).then(comm=>{
    var users=[];
    var admins=[];
    var requests=[];
    fetchUser(comm,users,admins,requests,function(){
   // console.log(users[0]);
    res.render('manageComm',{
      logger:req.user,
      comm,
      users,
      admins,
      requests,
      flag
    });
  });
});
});

router.post('/profile/commHome/manageComm',(req,res)=>{
  console.log('post',req.body);
 
});

router.get('/profile/commHomm/editComm',(req,res)=>{

})
router.get('/profile/commHome/addComm',(req,res)=>{
  res.render('addComm',{
    logger:req.user
});
});

router.get('/profile/commHome/listMembers',(req,res)=>{
  var id=req.query.id;
  var flag=false;
  Community.findById({_id:id}).then(communities=>{
    res.render('listMembers',{
      logger:req.user,
      comm:communities,
      flag
    });
  });
});

router.post('/profile/commHome/addComm',(req,res)=>{
  upload(req, res, (err) => {
    if(err){
      res.render('addComm', {
        msg: err,
        logger:req.user
      });
    } else {
      if(req.file == undefined){
        res.render('addComm', {
          msg: 'Error: No File Selected!'
        });
      } else {
        user=req.user;
        var {name,permission,description}=req.body;
        var img=req.file.filename;
        var newComm=new Community({
          name,
          permission,
          img,
          description
        })
        console.log(user);
        id=req.user._id;
        name=req.user.name;
        newComm.owner.push({id,name});
        newComm.save().then(user=>{
          console.log(user);
        });
        res.render('addComm', {
          succ: 'Community Created',
          logger:req.user
        });
      }
    }
  });
});

router.get('/profile/changePassword',(req,res)=>{
  res.render('changePassword',{
    logger:req.user
  });
});

router.post('/profile/changePassword',(req,res)=>{
  const {password1,password2}=req.body;
  console.log('ths',req.user.password);
  bcrypt.compare(password1, req.user.password, (err, isMatch) => {
    if (err) throw err;
    if (isMatch) {
      req.user.password=password2;
      require('../config/bcrypt')(req.user);
    } else {
      let errors=[];
      errors.push({msg:'Current Password Not Correct'});
      if(errors.length>0)
      {
        res.render('changePassword',{
          errors,
          logger:req.user
        });
      }
    }
  });
})

router.get('/profile',(req,res) =>
{  
     var user=req.user;
     console.log('Logged in User', user);
     console.log(req.session);
   if(user.status === 'Pending')
   {
     res.redirect('/addInfo');
   }
   else{
     res.render('profile',{
         logger:req.user
     });
    }
});

router.get('/profile/addUser',(req,res)=>{
  res.render('addUser',{
    logger:req.user
  })
});

router.get('/profile/userList',(req,res)=>{
  User.find({}).then(users=>{
    console.log(users[0]);
      res.render('userList',{
      users,
      logger:req.user
    });
  });
});


router.post('/profile/addUser',(req,res)=>{
    const{email,phone,city,password,roleoptions} = req.body;
    var errors = [];
    User.findOne({ email: email}).then(user => {
      if (user) {
        errors.push({msg: 'That Email Is Already Registered'}); 
       
      }
      if ( !email || !password) {
        errors.push({ msg: 'Please enter all fields' });
      }
    
      if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
       
      }
    
      if (phone.length < 10) {
          errors.push({ msg: 'Phone must be at least 10 characters' });
          
        }
      if (errors.length > 0) {
        res.render('addUser', {
          errors,
          logger:req.user
        });
      }
     else{
        
      const newUser=new User({
          email,
          phone,
          city,
          password,
          roleoptions
      });
      require('../config/bcrypt')(newUser);
      newUser.save().then(user=>{
          console.log('User is Now Registered');
          req.user=newUser;
          res.redirect('/profile');
      }).catch(err =>{
        console.log(err);
        res.render('addUser',{
          msg: 'Email is Already Taken',
          logger:req.user
        });
      });
     
     }
    });
    
});
router.get('/home',(req,res)=> res.render('home'));

router.post('/home',(req,res,next)=>{
    passport.authenticate('local',{
    successRedirect:'/profile',
    failureRedirect:'/',
    failureFlash:true
    })(req,res,next); 
}); 

router.get('/profile/logout',(req,res)=>{
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/home');
});

module.exports = router;