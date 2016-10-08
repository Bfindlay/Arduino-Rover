#include <SoftwareSerial.h>                     // Software Serial Port
#include <Servo.h>  
#include "Delay.h" 
//A4 -> SDA
//A5 ->SCL
NonBlockDelay d; 
NonBlockDelay search;
SoftwareSerial bt(2,3);  //TX | RX

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
void setup() {
  Serial.begin(9600);
  /* Initialise the sensor */
  if(!mag.begin())
  {
    /* There was a problem detecting the HMC5883 ... check your connections */
    Serial.println("Ooops, no HMC5883 detected");
    while(1);
  }
  
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

  
 
}
void loop() {

  while(avoiding){
    avoid();
  }
  check();
  Serial.println(dir);
  if (d.Timeout()) {  
    Move();
    d.Delay(500);
  }   

  
 }

void check(){
  if (distance() > 0 && distance() < 5){
    Serial.println("----------------------------");
    Serial.println("Avoiding");
    avoiding = true;
    avoid();
  }
}

void avoid(){

  //DELAY ALLOWED BECAUSE STOPPED
  if(search.Timeout()){
    Serial.println("Scanning");
    reverse();
    delay(100);
    scanner.write(10);
    distLeft = distance();
    delay(500);
    scanner.write(179);
    distRight = distance();
    delay(500);
    scanner.write(90);
    avoiding = false;
    Serial.println("Search done");
     dir = (distLeft > distRight) ? 'L' : 'R';
     Move();
     search.Delay(600);
  }
  dir = 'F';
  
}
void readSerial(){
   if(bt.available()){ // Checks whether data is comming from the serial port
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
    }
  }
}


void Move(){
  switch(dir) {
    case 'F':
      Serial.println("forward");
      forward();
      break;
    case 'B':
      Serial.println("Reverse");
      reverse();
      break;
    case 'L':
      Serial.println("Left");
      left();
      break;
    case 'R':
      Serial.println("right");
      right();
      break;
  }
}
void compass(){
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
  if(heading < 0)
    heading += 2*PI;
    
  // Check for wrap due to addition of declination.
  if(heading > 2*PI)
    heading -= 2*PI;
   
  // Convert radians to degrees for readability.
  float headingDegrees = heading * 180/M_PI; 
  
 //Serial.print("Heading (degrees): "); Serial.println(headingDegrees);
  // send heading to control arduino
  bt.print("{'heading': '");
  bt.print(headingDegrees);
  bt.print("'}");

}

int distance(){

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
  cm = (duration/2) / 29.1;
  dist = cm;
  bt.print("{'distance': '");
  bt.print(cm);
  bt.print("'}");
  return cm;
}


void left(){
  Serial.println("left");
  dir = 'L';
    bt.println("{'direction': 'left'}");
    servoLeft.writeMicroseconds(1300);         // Left wheel clockwise
    servoRight.writeMicroseconds(1300);        // Right wheel clockwise

}

void right(){
  dir = 'R';
  Serial.println("right");
    bt.println("{'direction': 'right'}");
    servoLeft.writeMicroseconds(1700);         // Left wheel counterclockwise
    servoRight.writeMicroseconds(1700);        // Right wheel counterclockwise
}

void forward(){
  
  
  dir = 'F';
    
    compass();
    bt.println("{'direction': 'forward'}");
    servoLeft.writeMicroseconds(1700);        
    servoRight.writeMicroseconds(1200);
    
}

void reverse(){
  dir = 'B';
    Serial.println("reverse");
    bt.println("{'direction': 'backwards'}");
    servoLeft.writeMicroseconds(1300);         // Left wheel clockwise
    servoRight.writeMicroseconds(1700);        // Right wheel counterclockwise  
}

void STOP(){
  dir = 'S';
  servoLeft.writeMicroseconds(1500);         // stop left
  servoRight.writeMicroseconds(1500);
}
