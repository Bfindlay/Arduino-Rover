'use strict';

function setup() {
  createCanvas(800, 400);
  background(255, 0, 0);
  window.rover = new Rover();
  rover.show();
}

function draw() {
    //rover.show;
    console.log("x", mouseX);
    console.log("y", mouseY);
}


let plotter = (x, y) => {
  //  console.log("got a plot", x, y);
  let xx = (Math.cos(x * Math.PI / 180) * y)+400;   // move object 17 pixels in direction 257
  // y += sin(257*pi/180)*17;`
  let yy = (Math.sin(x * Math.PI / 180) * y)+200;
  //console.log(xx, yy);
  ellipse(xx, yy, 10, 10);
};


function Rover(){
  this.y = 200;
  this.x = 400;
  this.xOffset = 400;
  this.yOffset = 200;

  this.show = function(){
    fill(0);
    ellipse(this.x,this.y,10,10);
  };

  this.update = function(heading){
  
    if(heading < 10){
      this.xOffset +=  0;
      this.yOffset -= 2;
    }else if(heading < 20){
      this.xOffset +=  1;
      this.yOffset -= 2;
    } else if(heading < 25){
      this.xOffset +=  2;
      this.yOffset -= 3;
    }else if(heading < 180){
      this.xOffset += 2;
      this.yOffset += 1;
    }else if(heading < 180){
       this.xOffset -=2;
      this.yOffset +=1;
    }else{
      this.xOffset -=2;
      this.yOffset -=1;
    }
   
   this.x = (Math.cos(heading * Math.PI / 180) * 2) + this.xOffset ;   // move object 2 pixels in direction heading
   this.y = (Math.sin(heading * Math.PI / 180) * 2) + this.yOffset;

   this.show();
  //console.log("it is", this.y);

  };
}
