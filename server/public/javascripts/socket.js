
  var socket = io.connect();
  socket.on('update', function (data) {
    console.log("received!", count++);
    ball.up();
  });

  var data= {
    button : true
  }
  var send = function(){
    console.log("object sent");
    socket.emit('event', data);
  }
