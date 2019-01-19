var User=require('../model/schema');
var Community=require('../model/community');

module.exports=function(comm,users,admins,requets,callback){
    users = fetch(comm.users);
    admins = fetch(comm.admins);
    requests = fetch(comm.request);
    if(users.length!=0 && admins.lengths!=0 &&requests.length!=0)
      callback   
}
function fetch(users){
    var array=[];
    list(users,array,function(){
        console.log('sc',array[0]);
    })
}
function list(users,array,callback)
{
    for( let i=0;i<users.length;i++)
    {
        User.findById({_id:users[i].id}).then(user=>{
            array.push(user);
            console.log('dfdf');
        }).catch(err=>{
            console.log(err);
        })
    }
    setTimeout(callback,2000);
    
    
}