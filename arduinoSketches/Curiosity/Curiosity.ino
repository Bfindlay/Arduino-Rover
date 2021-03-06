#include <SoftwareSerial.h>                     // Software Serial Port
#include <Servo.h>
#include "Delay.h"
//A4 -> SDA
//A5 ->SCL
NonBlockDelay d;
NonBlockDelay search;
NonBlockDelay inner;
SoftwareSerial bt(2, 3); //TX | RX

/**** SERVO ****/
Servo servoRight;
Servo servoLeft;
Servo scanner;

/******* RANGEFINDER **********/
int trigPin = 8;    //Trig - green Jumper
int echoPin = 9;    //Echo - yellow Jumper
long duration, cm;

/******COMPASS *************/
#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_HMC5883_U.h>

/* Assign a unique ID to this sensor at the same time */
Adafruit_HMC5883_Unified mag = Adafruit_HMC5883_Unified(12345);

char dir = 'F';
char c;
int dist;
int distLeft;
int distRight;
bool avoiding = false;
bool Auto = true;

void setup() {
  //Serial.begin(9600);
  /* Initialise the sensor */
  if (!mag.begin())
  {
    /* There was a problem detecting the HMC5883 ... check your connections */
    while (1);
  }

  /*** IR SENSOR ****/
  pinMode(A0, INPUT); // IR SENSOR

  pinMode(2, INPUT); //RX
  pinMode(3, OUTPUT); //TX
  bt.begin(57600); // Default communication rate of the Bluetooth module

  //Trigger and echo pins for the ultrasonic sensor
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(A0, INPUT);

  // Add servos to pins 12 and 13
  servoRight.attach(12);
  servoLeft.attach(13);
  scanner.attach(10);

  scanner.write(90);

  // MODE LED
  pinMode(7, OUTPUT);
  digitalWrite(7, HIGH);

}
/**
* Main program loop
*/

void loop() {
  // If auto mode is on, enter the autonomouse movement loop
  if (Auto) {
    if (d.Timeout()) {
      Move();
      d.Delay(100);
      //THis runs every 0.1 seconds
    }
    digitalWrite(7, HIGH);
    //this runs continuously
    check();
  }else{
    digitalWrite(7, LOW);
  }
  // Check the bluetooth buffer for any commands
  readSerial();
}

void check() {
  
  /***** EDGE DETECTOR READING *******/
   unsigned int detector = analogRead(A0);
    if(detector < 500){
      reverse();
      delay(500);
      STOP();
      right();
      delay(250);
      forward();
      avoid();
    }

  /***** DISTANCE SENSOR READING *******/
  if (distance() > 0 && distance() < 6) {
    avoiding = true;
    avoid();
  }
}

void avoid() {

  if (search.Timeout()) {
    STOP();
    // Look left and measure distance
    lookLeft();
    distLeft = distance();
    // Look right and measure distance
    lookRight();
    distRight = distance();
    lookCenter();
    avoiding = false;
    reverse();
    delay(100);
    // Choose best direction to travel
    (distLeft >= distRight) ? left() : right();
    delay(250);
  }
  // Set the direction to forward
  dir = 'F';

}

/**
* Checks the bluetooth serial buffer for any commands
* sent to the rover and sets and action 
*/
void readSerial() {
  if (bt.available()) { // Checks whether data is comming from the serial port
    c = bt.read();
    switch (c) {
      case 'F':
        forward();
        break;
      case 'R':
        right();
        break;
      case 'L':
        left();
        break;
      case 'B':
        reverse();
        break;
      case 'H':
        compass();
        break;
      case 'D':
        distance();
        break;
      case 'M':
        modeSet();
        break;
    }
  }
}

/**
* Switches auto mode on or off depending on its state
*/
void modeSet() {
  Auto = !Auto;
  if (!Auto) {
    STOP();
    digitalWrite(7, LOW);
  } else {
    digitalWrite(7, HIGH);
    dir = 'F';
  }

}

/**
* Excecutes the appropriate function based on the current direction state
*/
void Move() {
  switch (dir) {
    case 'F':
      forward();
      break;
    case 'B':
      reverse();
      break;
    case 'L':
      left();
      break;
    case 'R':
      right();
      break;
  }
}

/**
* Turns the rover left
*/
void left() {
  dir = 'L';
  bt.println("{'direction': 'left'}");
  servoLeft.writeMicroseconds(1300);         // Left wheel clockwise
  servoRight.writeMicroseconds(1300);        // Right wheel clockwise

}

/**
* Turns the rover right
*/
void right() {
  dir = 'R';
  bt.println("{'direction': 'right'}");
  servoLeft.writeMicroseconds(1700);         // Left wheel counterclockwise
  servoRight.writeMicroseconds(1700);        // Right wheel counterclockwise
}

/**
* Moves the rover forwrd
*/
void forward() {
  dir = 'F';
  compass();
  distance();
  bt.println("{'direction': 'forward'}");
  servoLeft.writeMicroseconds(1700);
  servoRight.writeMicroseconds(1100);

}

/**
* Moves the robot backwards
*/
void reverse() {
  dir = 'B';
  bt.println("{'direction': 'backwards'}");
  servoLeft.writeMicroseconds(1300);         // Left wheel clockwise
  servoRight.writeMicroseconds(1700);        // Right wheel counterclockwise
}


void STOP() {
  dir = 'S';
  servoLeft.writeMicroseconds(1500);         // stop left
  servoRight.writeMicroseconds(1500);
}

/**
* Calculates the rovers current heading in degrees and sends it to the
* control arduino via a json string
*/
void compass() {
  /* Get a new sensor event */
  sensors_event_t event;
  mag.getEvent(&event);

  // Calculate heading when the magnetometer is level, then correct for signs of axis.
  float heading = atan2(event.magnetic.y, event.magnetic.x);

  // Once you have your heading, you must then add your 'Declination Angle', which is the 'Error' of the magnetic field in your location.
  // Find yours here: http://www.magnetic-declination.com/
  // Mine is: -13* 2' W, which is ~13 Degrees, or (which we need) 0.22 radians
  // If you cannot find your Declination, comment out these two lines, your compass will be slightly off.
  float declinationAngle = 0.209;
  heading += declinationAngle;

  // Correct for when signs are reversed.
  if (heading < 0)
    heading += 2 * PI;

  // Check for wrap due to addition of declination.
  if (heading > 2 * PI)
    heading -= 2 * PI;

  // Convert radians to degrees for readability.
  float headingDegrees = heading * 180 / M_PI;

  //Serial.print("Heading (degrees): "); Serial.println(headingDegrees);
  // send heading to control arduino
  bt.print("{'heading': '");
  bt.print(headingDegrees);
  bt.print("'}");

}

/**
* Calculates the distance from the rover to an object
* and then sends the result as a json string to the control arduino
*/
int distance() {

  digitalWrite(trigPin, LOW);
  delayMicroseconds(5);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  // Read the signal from the sensor: a HIGH pulse whose
  // duration is the time (in microseconds) from the sending
  // of the ping to the reception of its echo off of an object.
  pinMode(echoPin, INPUT);
  duration = pulseIn(echoPin, HIGH);
  // convert the time into a distance
  cm = (duration / 2) / 29.1;
  dist = cm;
  bt.print("{'distance': '");
  bt.print(cm);
  bt.print("'}");
  return cm;
}

/**** Ultrasonic scanner control functions ****/
void lookLeft(){
  scanner.write(180);
  delay(300);
}

void lookRight(){
  scanner.write(0);
  delay(300);
}
void lookCenter(){
  scanner.write(90);
  delay(300);
}

