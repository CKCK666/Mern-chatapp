const Users=[]

const addUser=({id,name,room})=>{
   
      name=name.trim().toLowerCase()
      room=room.trim().toLowerCase()

      //check user exist or not
      const existingUser=Users.find((user)=>user.name==name && user.room==room)
      
      //if user exist
      if(existingUser){
        return{error:"user already exist"}
      }

    //new user
    const user={id,name,room}
     Users.push(user)
    return {user}
    
}

const removeUser=(id)=>{
    const index =Users.findIndex((user)=>user.id==id)
    if(index !== -1){
        return Users.splice(index,1)[0]
    }
    
}

const getUser=(id)=>{
    return Users.find(user=>user.id===id)
}

const getUserInRoom=(room)=>{
   return Users.filter((user)=>user.room==room)
}

module.exports={addUser,Users,getUser,removeUser,getUserInRoom}