'use strict';

let socket = io.connect();

socket.on('update', function (data) {
  console.log("received!");
});

let  left = () => {
    console.log("object sent");
    socket.emit('event', {action: 'left'});
}

let right = () => {
    console.log("object sent");
    socket.emit('event', {action: 'right'});
}

let forward = () => {
    console.log("object sent");
    socket.emit('event', {action: 'right'});
}

let reverse = () => {
    console.log("object sent");
    socket.emit('event', {action: 'right'});
}


document.addEventListener('keydown', e => {
  console.log('keydown', e.key);
  return (e.key === "a" ) ?  left(): (e.key === "d") ? right() : null ;
 
});