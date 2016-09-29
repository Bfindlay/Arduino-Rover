'use strict';
let express = require('express')
var app = express();
var path = require('path');
let servers = require('http').Server(app);
let io = require('socket.io')(servers);
let home = require('./routes/home');
let api = require('./routes/api');
var SerialPort = require('serialport');

var serialport = new SerialPort('/dev/cu.usbmodem1421', {
  //parser: SerialPort.parsers.byteLength(3)
 // parser: SerialPort.parsers.readline('\n')
 //parser: SerialPort.parsers.byteLength(5)
 parser: SerialPort.parsers.byteDelimiter([123,125])
  //parser: SerialPort.parsers.readline('\n')
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
  io.sockets.on('connection', function (socket) {
      //Connecting to client 
      console.log('Socket connected');
      socket.emit('connected');

      serialport.on('data', function (data) {
        
       // console.log("Returned", data);
      
        let result = safeParse(new Buffer(data));
        //TODO fix this lol
        //TODO handle when result is undefined
        console.log(result);
        if(result !== undefined){
          if(result.heading !== undefined){
            socket.emit('heading', result);
          }else if (result.distance !== undefined){
            socket.emit('distance', result);
          }else{
            //direction object
            socket.emit('return', result);
          }
        }
      });

      socket.on('data', function (data) {
        console.log("got data", data);
        serialport.write(data);
      });
  });
});

let safeParse = data => {
  try{
    return JSON.parse(data.toString().replace(/\s/g, '').replace(/'/g, '"'));
  }catch (e){
    console.log("parse error" , e);
  }
};

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

