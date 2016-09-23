
$(function(){
      $(".terminal").typed({
        strings: ["Waiting for rover connection"],
        typeSpeed: 2
      });
  });


var connect = function(){
    console.log("connecting");
     $(".terminal").typed({
        strings: ["Establishing uplink connection to rover ","......" ,"uplink failed"],
        typeSpeed: 2
      });
};

var refreshLogs = function(){
    console.log('refreshing logs');
    $(".terminal").typed({
        strings: ["Refreshing logs", "please wait"],
        typeSpeed: 2
      });
};

var refreshMap = function(){
    console.log('refreshing map');
    $(".terminal").typed({
        strings: ["Refreshing Map", "please wait"],
        typeSpeed: 2
      });
}

var left = function(){
    console.log('left');
    $(".terminal").typed({
         strings: ["Sending left turn command", "waiting for response from rover", "Success"],
        typeSpeed: 2
      });
}

var right = function(){
    console.log('right');
    $(".terminal").typed({
         strings: ["Sending right turn command", "waiting for response from rover", "Success"],
        typeSpeed: 2
      });
}

var forwards = function(){
    console.log('forwards');
    $(".terminal").typed({
        strings: ["Sending drive command", "waiting for response from rover", "Success"],
        typeSpeed: 2
      });
}

var reverse = function(){
    console.log('rreverse');
    $(".terminal").typed({
        strings: ["Sending reverse command", "waiting for response from rover", "Success"],
        typeSpeed: 2
      });
}