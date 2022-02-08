import express from 'express'
import http from 'http'
import cors from 'cors'
import {Server} from 'socket.io'

const app=express()
app.get('/',(req,res)=>{
    res.send("Server is ONLINE.")   
})
app.use(cors)

const port = process.env.PORT || 3001
const server = http.createServer(app)
const io = new Server(server,{
    cors:{
        origin:"*",
        methods:"GET,POST"
    }
})

const users = []
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);
  
    if (index !== -1) {
      return users.splice(index, 1)[0];
    }
  }
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
  }
io.on("connection",(socket)=>{
    console.log(`User ID:${socket.id} has connected... `)

    socket.on("joinRoom",(data)=>{
        socket.join(data.room)
        console.log(`User: ${data.username} has joined room: ${data.room}`)
        const user = {id:socket.id,username:data.username,room:data.room}
        users.push(user)

        io.to(user.room).emit('roomInfo',{room:user.room,users:getRoomUsers(user.room)})

    })
    socket.on("sendMessage",(data)=>{ 
        socket.to(data.room).emit("recieveMessage",data)
        console.log(data.room)
    })
    socket.on("disconnect",()=>{
        const user = userLeave(socket.id);

        if (user) {
          io.to(user.room).emit('roomInfo', {
            room: user.room,
            users: getRoomUsers(user.room)
          });
        }
      });
})

server.listen(port,()=>{
    console.log('Server is Online...')
})
