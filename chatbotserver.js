import express from 'express'
import http from 'http'
import cors from 'cors'
import {Server} from 'socket.io'

const app=express()

app.use(cors)

const port = process.env.PORT || 3001
const server = http.createServer(app)
const io = new Server(server)

io.on("connection",(socket)=>{
    console.log(`User ID:${socket.id} has connected... `)

    socket.on("joinRoom",(data)=>{
        socket.join(data.room)
        console.log(`User: ${data.username} has joined room: ${data.room}`)
    })
    socket.on("sendMessage",(data)=>{ 
        socket.to(data.room).emit("recieveMessage",data)
        console.log(data.room)
    })
    socket.on("disconnect",()=>{
        console.log(`User ID:${socket.id} has disconnected... `)
    })
})

server.listen(port,()=>{
    console.log('Server is Online...')
})
const port = server.address().port;
console.log(`Express is working on port ${port}`);

app.get('/',(req,res)=>{
    res.send("Server is Online!")
})


