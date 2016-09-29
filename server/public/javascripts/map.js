'use strict';

function setup() {
  createCanvas(800, 400);
  background(255, 0, 0);
}

// CASE 3
// Only draw().
// createCanvas() is called automatically with defaults.
function draw() {
<<<<<<< Updated upstream
  strokeWeight(4);  // Thicker
   point(mouseX, mouseY);
=======
  rover.show();
>>>>>>> Stashed changes
}


let plotter = (x, y) => {
  //  console.log("got a plot", x, y);
  let xx = Math.cos(x * Math.PI / 180) * y;   // move object 17 pixels in direction 257
  // y += sin(257*pi/180)*17;`
  let yy = Math.sin(x * Math.PI / 180) * y;

  xx += 400;
  yy += 200;

<<<<<<< Updated upstream
  console.log(xx, yy);
  ellipse(xx, yy, 10, 10);
};
=======
  xVal = xx;
  yVal = yy;
  // console.log(xx, yy);
  fill(255);
  //ellipse(xx, yy, 10, 10);
};


function Rover(){
  this.y = height/2;
  this.x = width/2;

 
  this.show = function(){
    fill(0);
    ellipse(this.x,this.y,10,10);
  };

  this.update = function(heading){
    console.log(heading);
    this.x = (Math.cos(heading * Math.PI / 180) + 400)   // move object y pixels in direction 257
    // y += sin(257*pi/180)*17;`
    this.y += 10;

  };
}
>>>>>>> Stashed changes
