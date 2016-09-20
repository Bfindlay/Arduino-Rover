'use strict';

let express = require('express')
var app = express();
let servers = require('http').Server(app);
let io = require('socket.io')(servers);
//255a5de7908a4a2c92d732b8b84ed707




app.use(express.static(__dirname + '/public'));

app.get('/', function(req,res){
    res.sendFile(__dirname + '/public/index.html');
    console.log("/ accessed");
});
app.get('/api', function(req,res){
  res.send("hello");
  console.log("api"); 
});
io.on('connection', function(socket){
  socket.on('event', function (data) {
    console.log("got connection");
    io.emit('update', { up: true });
  });
});

servers.listen(process.env.port || 3000, function(){
  console.log("running");
});