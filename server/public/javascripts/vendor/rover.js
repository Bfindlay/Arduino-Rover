
var logs = [];
(function(){
      $('.terminal').typeIt({
     strings: ['Initialising rover uplink','Rover uplink connection Successful', "rover is ready"],
     speed: 15,
    });
})();


var connect = function(){
     $('.terminal').typeIt({
        strings: ["Establishing uplink connection to rover ","Initialising .........." ,"success"],
        speed: 20,
      });
      socket.connect();
      addLog();
};
var disconnect = function(){
     $('.terminal').typeIt({
        strings: ["Closing rover connection", "success"],
        speed: 10
      });
      socket.disconnect();
      addLog();
};

var refreshLogs = function(){
    $(".terminal").typeIt({
        strings: ["Refreshing logs", "please wait"],
        speed: 10
      });
      logs = [];
};

var refreshMap = function(){
    $('.terminal').typeIt({
        strings: ["Refreshing Map", "please wait"],
        speed: 10
      });
      addLog();
}

var left = function(){
    addLog();
    
    var strings =  ["Sending left turn command", "waiting for rover response",  (state) ? "Success" : "Failed"];
    $('.terminal').typeIt({
         strings: strings,
         speed: 10
      });
      console.log("sending LEFT data");
      socket.emit('data', 'L');
      logs.push(strings);
      
};

var right = function(){
    var strings = ["Sending right turn command", "waiting for rover response", (state) ? "Success" : "Failed"];
    addLog();
    $('.terminal').typeIt({
         strings: strings,
        speed: 10
      });
      socket.emit('data', 'R');
      logs.push(strings);

}

var forwards = function(){
     addLog();
     var strings = ["Sending drive command", "waiting for rover response", (state) ? "Success" : "Failed"];
    $('.terminal').typeIt({
        strings: strings,
        speed: 10
      });
      socket.emit('data', 'F');
      logs.push(strings);
      
}

var reverse = function(){
     addLog();
     var strings = ["Sending reverse command", "waiting for rover response", (state) ? "Success" : "Failed"];
    $('.terminal').typeIt({
        strings: strings,
        speed: 10
      });
      socket.emit('data', "B");
      logs.push(strings);
}

var addLog = function(){
    if(logs.length > 0){
        $("ul").append("<li> >" +logs.pop()+"</li>");
       $('.terminal-Logs').animate({scrollTop: $('.terminal-Logs').prop("scrollHeight")}, 500);
    }
};