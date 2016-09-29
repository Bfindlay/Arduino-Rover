'use strict';

function setup() {
  createCanvas(800, 400);
  background(255, 0, 0);
}

// CASE 3
// Only draw().
// createCanvas() is called automatically with defaults.
function draw() {
  strokeWeight(4);  // Thicker
   point(mouseX, mouseY);
}


let plotter = (x, y) => {
  //  console.log("got a plot", x, y);
  let xx = Math.cos(x * Math.PI / 180) * y;   // move object 17 pixels in direction 257
  // y += sin(257*pi/180)*17;`
  let yy = Math.sin(x * Math.PI / 180) * y;

  xx += 400;
  yy += 200;

  console.log(xx, yy);
  ellipse(xx, yy, 10, 10);
};
