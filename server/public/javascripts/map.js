'use strict';


let detected = [];
let plots =[];

function setup() {
  let height = $('.map-flex').height();
  let width = $('.map-flex').width();
  var canvas  = createCanvas(width, height);
  canvas.parent('mapbox');
  window.rover = new Rover();
  window.ping = new Ping();
  ping.show();
  rover.show();
}

function draw() {
    clear();
    rover.show();
    ping.show();
    ping.update();
    ping.obstacles();
}

let plotter = (x, y) => {
  let xx = (Math.cos(x * Math.PI / 180) * y)+ rover.x;  
  let yy = (Math.sin(x * Math.PI / 180) * y)+ rover.y;
  detected.push([xx,yy]);
};

class Ping {
  constructor(){
    this.y = ( $('.map-flex').height() / 2);
    this.x = ( $('.map-flex').width() / 2 );
    this.radius = 0;
    this.distance = () => {
        var a =  $('.map-flex').width()/2 - this.radius;
        var b =  $('.map-flex').height()/2 - this.radius; 
        return Math.sqrt( a*a + b*b );
    };
  }
    show() {
      noFill();
      stroke(0,255,0);
      ellipse(this.x, this.y, this.radius, this.radius);
      ellipse(this.x, this.y, this.radius -10, this.radius-10);
    };

    update(){
      if(this.radius > this.x * 3){
        this.radius = 0;
      }else{
        this.radius +=6;
      }
    }

    obstacles(){
      detected.forEach( e => {
        var a = this.x - e[0];
        var b = this.y - e[1];
        var c = Math.sqrt( a*a + b*b );
        if((this.distance() - c ) < 2){
          ellipse(e[0],e[1], 10, 10);
        }
      });
    }
}

class Rover {
 
 constructor(){
    this.y = ( $('.map-flex').height() / 2);
    this.x = ( $('.map-flex').width() / 2 );
 }
  show() {
    fill(0, 255, 0);
    noStroke();
    ellipse(this.x,this.y,5,5);
  }

  update(heading) {
    //make the new plot in direction pointing 
    this.x = (Math.cos(heading * Math.PI / 180) * 1.5)+ this.x;   // offset x = width/2 initially
    this.y = (Math.sin(heading * Math.PI / 180) * 1.5)+ this.y;  // offset y = height/2 initially
    plots.push([this.x,this.y]);
    //ellipse(this.x, this.y, 5, 5); // draw the new point;
  };
}


 let set = new p5((p) => {
  p.setup = function () {
    let height = $('.map-flex').height();
    let width = $('.map-flex').width();
    let canv =  p.createCanvas(width, height);
    canv.parent('route');
  };

  p.draw = () => {
    plots.forEach(e => ellipse(e[0], e[1], 5, 5));
  };

});