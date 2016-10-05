'use strict';

let logs = [];



document.addEventListener("keydown",e  => {
    if(e.key == "ArrowRight"){
        $('.right').css('border', '0.5em solid #e74c3c');
        right();
        setTimeout(() => {
            $('.right').css('border', '0.5em solid rgba(31, 240, 66, 0.75)');
        },150);
    }else if(e.key == "ArrowLeft"){
        $('.left').css('border', '0.5em solid #e74c3c');
        left();
        setTimeout(() => {
            $('.left').css('border', '0.5em solid rgba(31, 240, 66, 0.75)');
        },150);
    }else if(e.key == "ArrowUp"){
        $('.top').css('border', '0.5em solid #e74c3c');
        forwards();
        setTimeout(() => {
            $('.top').css('border', '0.5em solid rgba(31, 240, 66, 0.75)');
        },150);
    }else if(e.key == "ArrowDown"){
        $('.bottom').css('border', '0.5em solid #e74c3c');
        reverse();
        setTimeout(() => {
            $('.bottom').css('border', '0.5em solid rgba(31, 240, 66, 0.75)');
        },150);
    }
});

(() => {
      $('.terminal').typeIt({
     strings: ['Rover awaiting Initialisation'],
     speed: 1,
    });
})();

let STOP = () => {
    $('.terminal').typeIt({
        strings: ["Stopping rover", (window.state) ? "Success" : "Failed"],
        speed: 1
      });
    socket.emit('data', 'S');
};

let connect = () => {
     $('.terminal').typeIt({
        strings: ["Establishing uplink connection to rover ","Initialising .........." ,(window.state) ? "Success" : "Failed"],
        speed: 1,
      });
      socket.connect();
      addLog();
};

let disconnect = () => {
     $('.terminal').typeIt({
        strings: ["Closing rover connection", (window.state) ? "Success" : "Failed"],
        speed: 1
      });
      socket.disconnect();
      addLog();
};

let refreshLogs = () => {
    $(".terminal").typeIt({
        strings: ["Refreshing logs", "please wait"],
        speed: 10
      });
      logs = [];
};

let refreshMap = () => {
    $('.terminal').typeIt({
        strings: ["Refreshing Map", "please wait"],
        speed: 10
      });
      addLog();
}

let left = () => {
    addLog();
    let strings =  ["Sending left turn command", "waiting for rover response",  (window.state) ? "Success" : "Failed"];
    $('.terminal').typeIt({
         strings: strings,
         speed: 10
      });
      console.log("sending LEFT data");
      socket.emit('data', 'L');
      logs.push(strings);
      
};

let right = () => {
    let strings = ["Sending right turn command", "waiting for rover response", (window.state) ? "Success" : "Failed"];
    addLog();
    $('.terminal').typeIt({
         strings: strings,
        speed: 10
      });
      socket.emit('data', 'R');
      logs.push(strings);
};

let forwards = () => {
     addLog();
     let strings = ["Sending drive command", "waiting for rover response", (window.state) ? "Success" : "Failed"];
    $('.terminal').typeIt({
        strings: strings,
        speed: 10
      });
      socket.emit('data', 'F');
      logs.push(strings);
      
}

let reverse = () => {
     addLog();
     let strings = ["Sending reverse command", "waiting for rover response", (window.state) ? "Success" : "Failed"];
    $('.terminal').typeIt({
        strings: strings,
        speed: 10
      });
      socket.emit('data', "B");
      logs.push(strings);
}

let addLog = () => {
    if(logs.length > 0){
        $("ul").append("<li> >" +logs.pop()+"</li>");
       $('.terminal-Logs').animate({scrollTop: $('.terminal-Logs').prop("scrollHeight")}, 500);
    }
};

let hideObstacle = () => {
    if(displayDetected){
         $('#hideObstacle').text('Hide Obstacles');
    }else{
        $('#hideObstacle').text('Show Obstacles');
    }
    displayDetected = !displayDetected;
};
let clearObstacle = () => { 
    detected = [];
};
let hidePlot = () => {
    if(display){
        $('#hidePlot').text('Hide Plots');
    }else{
        $('#hidePlot').text('Show Plots');
    }
    display = !display;
};

let clearPlot = () => { 
    plots = [];
};
let getDistance = () => {
    socket.emit('data', 'D');
};

let getHeading = () => {
    socket.emit('data', 'H');
};
// poll the heading data on the rover every 3 seconds
setInterval(getDistance, 1500);
setInterval(getHeading, 1000);
var heading;
var distance;

socket.on('distance', data => {
    document.getElementById('distance').innerHTML = "Distance: "+ data.distance;
    distance = data.distance;
});


socket.on('heading', data => {
    heading = data.heading;
    document.getElementById('heading').innerHTML = "Heading: "+ data.heading;
    plotter(heading, distance);
    rover.update(heading);
});

