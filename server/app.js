'use strict';

let express = require('express')
var app = express();
let servers = require('http').Server(app);
let io = require('socket.io')(servers);


app.use(express.static(__dirname + '/public'));

app.get('/', function(req,res){
    console.log("/accessed");
    res.sendFile(__dirname + '/public/index.html');
    
});
app.get('/api', function(req,res){
  res.send("hello api");
})

io.on('connection', function(socket){
  socket.on('event', function (data) {
    console.log(data);
    io.emit('update', { up: true });
  });
});

servers.listen(process.env.port || 3000, function(){
  console.log("running");
});




