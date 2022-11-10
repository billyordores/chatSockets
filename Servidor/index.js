const express = require('express');
const app = express();
const cors = require('cors')
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server,{
  cors: {
      origin : "*",
      methods: ["GET", "POST"]
  }
});
var corsOptions = {
  origin: "*"
};
app.use(cors(corsOptions))

var users = [];
app.get('/users', function (req, res) {
    res.send(users)
});
const objectExist = ( user , msg) =>{
    for(i = 0; i<user.length; i++){
        if(user[i].email === msg.email ){
          return true;
        }
    }
    return false;
}
const getIdSocketbyEmail =( email )=>{
  for(i = 0; i<users.length; i++){
    if(users[i].email === email ){
      return users[i].idSocket;
    }
  }
}
io.on('connection', socket => {
    // username, idSocket, connected
    socket.on("conectado", (msg)=>{
      if(users.length === 0){
        users.push({username: msg.username, email:msg.email, idSocket: socket.id, connected: true })
        console.log("Usuario registrado", socket.id);
      }else{
        if(objectExist(users, msg)){
          users.map(( element )=> {
            if(element.email === msg.email){
              element.connected=true
              socket.id = element.idSocket
            } 
          } )

          console.log("Usuario conectado", socket.id);
        }else{
          users.push({username: msg.username, email: msg.email, idSocket: socket.id, connected: true });
          console.log("Usuario registrado", socket.id);
        }
      }
      console.log(msg.username);
    })
    socket.on("message-private", (msg)=>{
      console.log(msg);
      console.log(getIdSocketbyEmail(msg.addressee));
        socket.to(getIdSocketbyEmail(msg.addressee)).emit("message-private",  {msg:msg.msg, username: msg.username} )
    })
    socket.on("message-public", (msg)=>{
        socket.broadcast.emit("message-public",{msg:msg.msg, username: msg.username} )
    })
    socket.on("desconectado", (email) => {
      users.map((element)=>{
        if(element.email === email){
          element.connected = false;
          console.log("Usuario desconectado");
        }else{
          console.log("Error");
        }
      })
      
    });
});



// io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' }); // This will emit the event to all connected sockets

server.listen(3000, () => {
  console.log('listening on *:3000');
});