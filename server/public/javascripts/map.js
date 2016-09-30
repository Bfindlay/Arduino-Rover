'use strict';


function setup() {
  
  let height = $('.map-flex').height();
  let width = $('.map-flex').width();
  var canvas  = createCanvas(width, height);
  canvas.parent('mapbox');
  background(255, 0, 0);
  window.rover = new Rover();
  rover.show();
}

function draw() {
    rover.show();
}


let plotter = (x, y) => {
  let xx = (Math.cos(x * Math.PI / 180) * y)+ rover.x;  
  let yy = (Math.sin(x * Math.PI / 180) * y)+ rover.y;
  fill(255);
  ellipse(xx, yy, 10, 10);
};


function Rover(){
 
  this.y = ( $('.map-flex').height() / 2);
  this.x = ( $('.map-flex').width() / 2 );

  this.show = function(){
    fill(0);
    ellipse(this.x,this.y,10,10);
  };

  this.update = function(heading){

    //make the new plot in direction pointing 
    this.x = (Math.cos(heading * Math.PI / 180) * 1.5)+ this.x;   // offset x = width/2 initially

    this.y = (Math.sin(heading * Math.PI / 180) * 1.5)+ this.y;  // offset y = height/2 initially

    ellipse(this.x, this.y, 10, 10); // draw the new point;
  };
}
