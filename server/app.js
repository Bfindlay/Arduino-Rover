'use strict';
let express = require('express')
var app = express();
var path = require('path');
let servers = require('http').Server(app);
let io = require('socket.io')(servers);
let home = require('./routes/home');
let api = require('./routes/api');


var SerialPort = require('serialport');

var serialport = new SerialPort('/dev/cu.usbmodem141111', {
 // parser: SerialPort.parsers.byteLength(4)
 parser: SerialPort.parsers.byteLength(4)
});



// creating the parser and piping can be shortened to
//var parser = port.pipe(new ReadLine());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public'));

app.use('/', home);
app.use('/api', api);



/*** SERIAL PORT CONNECTION */
serialport.on('error', function(err){
  console.log("there was an error", err)
})
serialport.on('open', function(){


//TODO handle on disconnect event

  // Now server is connected to Arduino
  console.log('Serial Port Opend');

  var lastValue;
  io.sockets.on('connection', function (socket) {
      //Connecting to client 
      console.log('Socket connected');
      socket.emit('connected');
      var lastValue;

      serialport.on('data', function (data) {
        console.log('Data: ' + data.toString('utf8'));
        socket.emit('return', data);
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

