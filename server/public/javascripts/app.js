var logs = [];
$(function(){
      $('.terminal').typeIt({
     strings: ['Initialising rover uplink','Rover uplink connection failed','please establish a connection to the rover'],
     speed: 50,
    });
});


var connect = function(){
     $('.terminal').typeIt({
        strings: ["Establishing uplink connection to rover ","Initialising .........." ,"uplink failed"],
        typeSpeed: 2
      });
      addLog();
};

var refreshLogs = function(){
    $(".terminal").typeIt({
        strings: ["Refreshing logs", "please wait"],
        typeSpeed: 2
      });
      logs = [];
};

var refreshMap = function(){
    $('.terminal').typeIt({
        strings: ["Refreshing Map", "please wait"],
        typeSpeed: 2
      });
      addLog();
}

var left = function(){
    addLog();
    var strings =  ["Sending left turn command", "waiting for rover response", "failed"];
    $('.terminal').typeIt({
         strings: strings,
        typeSpeed: 2
      });
      logs.push(strings);
      
};

var right = function(){
    var strings = ["Sending right turn command", "waiting for rover response", "failed"];
    addLog();
    $('.terminal').typeIt({
         strings: strings,
        typeSpeed: 1
      });
      logs.push(strings);

}

var forwards = function(){
     addLog();
     var strings = ["Sending drive command", "waiting for rover response", "failed"];
    $('.terminal').typeIt({
        strings: strings,
        typeSpeed: 10
      });
      logs.push(strings);
      
}

var reverse = function(){
     addLog();
     var strings = ["Sending reverse command", "waiting for rover response", "failed"];
    $('.terminal').typeIt({
        strings: strings,
        typeSpeed: 2
      });
      logs.push(strings);
}

var addLog = function(){
    if(logs.length > 0){
        $("ul").append("<li> >" +logs.pop()+"</li>");
       $('.terminal-Logs').animate({scrollTop: $('.terminal-Logs').prop("scrollHeight")}, 500);
    }
};