'use strict';

let express = require('express')
var app = express();
var path = require('path');
let servers = require('http').Server(app);
let io = require('socket.io')(servers);
var home = require('./routes/home');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public'));

app.use('/mission-control', home);

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




