'use strict';
let express = require('express')
var app = express();
var path = require('path');
let servers = require('http').Server(app);
let io = require('socket.io')(servers);
let home = require('./routes/home');
let api = require('./routes/api');
let SerialPort = require("serialport");

let portConfig = {
         baudRate: 9600
     }
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public'));

app.use('/', home);
app.use('/api', api);



/*** SERIAL PORT CONNECTION */

var serialport = new SerialPort("/dev/cu.usbmodem141111", portConfig); // replace this address with your port address
serialport.on('open', function(){
  // Now server is connected to Arduino
  console.log('Serial Port Opend');

  var lastValue;
  io.sockets.on('connection', function (socket) {
      //Connecting to client 
      console.log('Socket connected');
      socket.emit('connected');
      var lastValue;

      serialport.on('data', function(data){
              console.log("Received",data.toString('utf8'));
              var ret = data.toString('utf8');
              socket.emit('return', ret);
         
      });
      socket.on('data', function (data) {
        console.log("got data", data);
        serialport.write(data);
      });
  });
});



// io.on('connection', function(socket){
//   console.log("got a connection!");
//   socket.on('event', function (data) {
//     console.log("got an event!");
//     console.log(data);
//     io.emit('update', { up: true });
//   });
// });

servers.listen(process.env.port || 3000, function(){
  console.log("running");
});




