'use strict';

/*** TODO
 * Display rover with triangle
 * Fix plot displaying
 * Wait for response before sending any more commands -> Reduce serial traffic /spamming
 * Fix connected to port message when cnnected to wrong port 
 */

let detected = [];
let plots = [];
let display = true;
let displayDetected = false;
let rover = null;
let ping = null;
let distance = null;
let heading = null;
function setup() {
	let height = $('.map-flex').height();
	let width = $('.map-flex').width();
	var canvas = createCanvas(width, height);
	canvas.parent('mapbox');
	rover = new Rover();
	ping = new Ping();
	ping.show();
	rover.show();
}

let x = ($('.map-flex').width());
let y = ($('.map-flex').height());

function draw() {
	clear();
	rover.show();
	ping.show();
	drawObstacles();
	background(0,255,0,5);
	textSize(20);
  	fill(0, 255,0, 100);
	let stateString =  (state) ? "Connected" : "Disconnected";
  	text("Distance: " + distance, 10, y -10); 
  	text("Heading: " + heading, 200, y -10); 
	text("Status: "+ stateString, 400, y -10); 
}

let plotter = (x, y) => {
	let xx = (Math.cos(x * Math.PI / 180) * y) + rover.x;
	let yy = (Math.sin(x * Math.PI / 180) * y) + rover.y;
	detected.push(new Obstacle(xx, yy));
};

class Ping {
	constructor() {
		this.x = ($('.map-flex').width() / 2);
		this.y = ($('.map-flex').height() / 2);
		this.radius = 0;
		this.alpha = 250;
		this.distance = () => {
			var a = this.x - this.radius;
			var b = this.y - this.radius;
			return Math.sqrt(a * a + b * b);
		};
	}

	show() {
		noFill();
		stroke(0, 255, 0, this.alpha - 4);
		strokeWeight(2);
		ellipse(this.x, this.y, this.radius + 20, this.radius + 20);
		stroke(0, 255, 0, this.alpha);
		strokeWeight(5);
		ellipse(this.x, this.y, this.radius, this.radius);
		this.update();
    	fill(0,255,0, 7);
		stroke(0, 255, 0, this.alpha - 4);
		strokeWeight(2);
		ellipse(this.x, this.y, this.radius - 25, this.radius - 25);
	}

	update() {
		if (this.radius > this.x * 2) {
			this.radius = 0;
			this.alpha = 200;
		} else {
			this.radius += 5;
			this.alpha --;
		}
	}
}

class Rover {

	constructor() {
		this.y = ($('.map-flex').height() / 2);
		this.x = ($('.map-flex').width() / 2);
	}
	show() {
		fill(255, 255, 0);
		noStroke();
		ellipse(this.x, this.y, 10, 10);
		beginShape();
		triangle(this.x, this.y, this.x+50, this.y-50, this.x-50, this.y+50);
		endShape();
	}

	update(heading) {
		this.x = (Math.cos(heading * Math.PI / 180) * 1.5) + this.x; // offset x = width/2 initially
		this.y = (Math.sin(heading * Math.PI / 180) * 1.5) + this.y; // offset y = height/2 initially
		plots.push(new Plot(this.x, this.y));
	}
}

class Plot {
  constructor(x,y) {
    this.x = x;
    this.y = y;
  }

  show() {
    fill(255, 0, 0);
    noStroke();
    ellipse(this.x, this.y, 10, 10);
  }

  hide() {
    fill(0,0);
    noStroke();
    ellipse(this.x, this.y, 1, 1)
  }
}

class Obstacle {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.distance = () => {
			var a = this.x - ($('.map-flex').width() / 2);
			var b = this.y - ($('.map-flex').height() / 2);
			return Math.sqrt(a * a + b * b);
		};
		this.alpha = 0;
		this.distance = this.distance();
		this.delta = () => { return (this.distance > 300) ? 6 : (this.distance > 200) ? 3 : 1;};
	}

	update() {
		this.alpha -= 2;
		if (this.alpha < 0) {
			this.alpha = 0;
		}
	}

	show() {
		const pingDist = this.distance - (ping.radius / 2);
		 if(pingDist < 15 && pingDist > -15) {
			this.alpha = 250;
		}
		else if (pingDist < 25 && pingDist > -25) {
			this.alpha = 100;
		}
		else if (pingDist < 30 && pingDist > -30) {
			this.alpha = 40;
		}
		this.update();
		fill(81, 254,13, this.alpha/this.delta());
		noStroke();
		ellipse(this.x, this.y, 12, 12);
	}

	toggle() {
		fill(81, 254,13, 100);
		noStroke();
		ellipse(this.x, this.y, 12, 12);
	}
}

let drawObstacles = () => {
	detected.forEach(e => {
		(displayDetected) ? e.toggle() : e.show();
	});
};


new p5((p) => {
	p.setup = function () {
		let height = $('.map-flex').height();
		let width = $('.map-flex').width();
		let canv = p.createCanvas(width, height);
		canv.parent('route');
	};

	p.draw = () => {
    drawPlane();
    fill(255,0,0,20);
      plots.forEach(e => {
         (display) ? e.show() : e.hide();
      });
	};
});

let  drawPlane = () => {
  let x = ($('.map-flex').width() / 2);
  let y = ($('.map-flex').height() / 2);
  textSize(11);
  fill(0,255,0);
  text("10", x+60, y+20); 
  text("40", x+120, y+20); 
  text("60", x+210, y+20); 
  //fill(0, 102, 153);
  noFill();
  strokeWeight(2);
  stroke(0,255,0,10);
  ellipse(x, y, 100, 100);
  ellipse(x, y, 200, 200);
  ellipse(x, y, 400, 400);
  ellipse(x, y, 600, 600);
};

// TODO FOR TESTING , REMOVE AND REPLACE
// let detected = [new Obstacle(500, 200), new Obstacle(30, 50), new Obstacle(200, 20), new Obstacle(200, 100), new Obstacle(340, 50)];
// let plots = [new Plot(200,100),new Plot(100,102),new Plot(100,203),new Plot(110,205),new Plot(115,200),new Plot(120,150),];