const express =require("express")
const {Server}=require("socket.io")
const http=require("http")
const router =require("./router")
const cors=require("cors")
const app=express()
const {addUser,getUser,getUsersInRoom,removeUser}=require("./users")


const server=http.createServer(app)
const PORT=process.env.PORT || 5000
app.use(cors()) 

const io=new Server(server,{
   cors: {
      origin: "http://localhost:3000",
    
    }
})

//new connection
io.on("connection",(socket)=>{
   console.log(`new connection ${socket.id}`) 

 //user join
   socket.on("join",async ({name,room},callback)=>{
     
    const {error,user}=await addUser({id:socket.id,name,room})
 if(user){
  socket.emit("message",{user:"admin",text:`Welcome ${user.name},to ${user.room} chat room` })
  socket.broadcast.to(user.room).emit("message",{user:"admin",text:`${user.name}  joined`})
  io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
  socket.join(user.room)
 }
   

    else {
      return callback(error)
    }
   
 
   })

   socket.on("sendMessages", async (message,callback)=>{
    const user = await getUser(socket.id)
    console.log(message)
    io.to(user.room).emit("message",{user:user.name,text:message})
    callback()
  })
  
  
   socket.on("disconnect", async()=>{
     const user=await removeUser(socket.id)
     if(user){
      io.to(user.room).emit("message",{user:"admin",text:`${user.name}  left...`})
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
     }

  
   })
})
app.use(router)
server.listen(PORT,()=>console.log(`server running ${PORT}`))