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
io.on("connection",(socket)=>{
    console.log(`User ID:${socket.id} has connected... `)

    const users = []

    const user = { id, username, room } 
    users.push(user)

    const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room)
    }


    socket.on("joinRoom",(data)=>{
        socket.join(data.room)
        socket.to(data.room).emit('roomInfo',{
            room:data.room,
            users:getUsersInRoom(data.room)
        })
        callback()
        console.log(`User: ${data.username} has joined room: ${data.room}`)
    })
    socket.on("sendMessage",(data)=>{ 
        socket.to(data.room).emit("recieveMessage",data)
        console.log(data.room)
    })
    socket.on("disconnect",()=>{
        console.log(`User ID:${socket.id} has disconnected... `)
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
          })
        
    })
})

server.listen(port,()=>{
    console.log('Server is Online...')
})
