'use strict';

let express = require('express');
let app = express();
let path = require('path');
let servers = require('http').Server(app);
let io = require('socket.io')(servers);
let home = require('./routes/home');
let bodyParser = require('body-parser');
let api = require('./routes/api');
let SerialPort = require('serialport');
let serialport = new SerialPort('null', {
		parser: SerialPort.parsers.byteDelimiter([123,125])
	});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.use('/', home);
app.use('/api', api);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let connect = port => {
	/*** SERIAL PORT CONNECTION */
	console.log("connecting");
	serialport = new SerialPort(port, {
		parser: SerialPort.parsers.byteDelimiter([123,125])
	});
	serialport.on('open', function() {
		// Now server is connected to Arduino
		console.log('Serial Port open');
		io.sockets.on('connection', socket => {
			//  Connecting to client 
			console.log('Socket connected');
			socket.emit('connected');
			serialport.on('data', data => {
				let result = safeParse(new Buffer(data));
				//console.log(result);
				if (result !== undefined) {
					if (result.heading !== undefined) {
						socket.emit('heading', result);
					} else if (result.distance !== undefined) {
						socket.emit('distance', result);
					} else {
						socket.emit('return', result); //  direction object
					}
				}
			});
			serialport.on('error', err => {
				console.log(err);
			});
			socket.on('data', data => {
				//console.log("data" + data);
				serialport.write(data);
			});
			socket.on('mode', mode => {
				serialport.write('M');
			});
			process.on('uncaughtException', err => {
				console.log(err);
			});
		});
	});
	Serialport.on('error' , e => {
		console.log(e);
	})
};

let safeParse = data => {
	try {
		return JSON.parse(data.toString().replace(/\s/g, '').replace(/'/g, '"'));
	} catch (e) {
		// Ignore 
	}
};

serialport.on('error', function(err) {
	console.log("Please choose a COM port");
	io.sockets.on('connection', function(socket){
		SerialPort.list(function (err, ports) {
			let availPorts = ports.filter( p =>  p.comName !== undefined);
			socket.emit('ports', availPorts);
		});
	});
});

servers.listen(process.env.port || 3000, function() {
	console.log("Server Running");
});

app.post('/port', function(req, res){
	connect(req.body.data);
});