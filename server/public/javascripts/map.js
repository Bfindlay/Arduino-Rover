'use strict';


/*** TODO
 * Add Plot object s there is ability to show/hide the plot
 * Display rover with triangle
 */


//let detected = [];

// TODO FOR TESTING , REMOVE AND REPLACE
let detected = [new Obstacle(500, 200), new Obstacle(30, 50), new Obstacle(200, 20), new Obstacle(200, 100), new Obstacle(340, 50)];


let plots = [];
let display = true;
function setup() {
	let height = $('.map-flex').height();
	let width = $('.map-flex').width();
	var canvas = createCanvas(width, height);
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
	drawObstacles();
  background(0,255,0,5);
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
		this.alpha = 220;
		this.distance = () => {
			var a = this.x - this.radius;
			var b = this.y - this.radius;
			return Math.sqrt(a * a + b * b);
		};
	}
	show() {
		noFill();
		stroke(0, 255, 0, this.alpha - 10);
		strokeWeight(2);
		ellipse(this.x, this.y, this.radius + 20, this.radius + 20);
		stroke(0, 255, 0, this.alpha);
		strokeWeight(5);
		ellipse(this.x, this.y, this.radius, this.radius);
		this.update();
    fill(0,255,0, 7);
		stroke(0, 255, 0, this.alpha - 10);
		strokeWeight(2);
		ellipse(this.x, this.y, this.radius - 25, this.radius - 25);
	}

	update() {
		if (this.radius > this.x * 2) {
			this.radius = 0;
			this.alpha = 200;
		} else {
			this.radius += 3;
			this.alpha--;
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
    fill(255, 0, 0, 60);
    noStroke();
    ellipse(this.x, this.y, 5, 5);
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
		this.alpha -= 5;
		if (this.alpha < 0) {
			this.alpha = 0;
		}
	}

	show() {
		const pingDist = this.distance - (ping.radius / 2);
		if (pingDist < 30 && pingDist > -30) {
			this.alpha = 125;
		}
		if (pingDist < 20 && pingDist > -20) {
			this.alpha = 150;
		}
		this.update();
		fill(0, 255, 0, this.alpha/this.delta());
		noStroke();
		ellipse(this.x, this.y, 10, 10);
	}
}

let drawObstacles = () => {
	detected.forEach(e => {
		e.show();
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
  translate(x, y);
  fill(0,255,0);
  text("10", 60, 20); 
  text("40", 120, 20); 
  text("60", 210, 20); 
  //fill(0, 102, 153);
  noFill();
  strokeWeight(2);
  stroke(0,255,0,30);
  ellipse(0, 0, 100, 100);
  ellipse(0, 0, 200, 200);
  ellipse(0, 0, 400, 400);
  ellipse(0, 0, 600, 600);
};