#include <SoftwareSerial.h>                     // Software Serial Port
#include <Servo.h>  

//A4 -> SDA
//A5 ->SCL

SoftwareSerial bt(2,3);  //TX | RX

/**** SERVO ****/               
Servo servoRight;
Servo servoLeft;

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



void setup() {
  
  /* Initialise the sensor */
  if(!mag.begin())
  {
    /* There was a problem detecting the HMC5883 ... check your connections */
    while(1);
  }
  
  pinMode(2, INPUT); //RX
  pinMode(3, OUTPUT); //TX
  bt.begin(57600); // Default communication rate of the Bluetooth module
  
  //Trigger and echo pins for the ultrasonic sensor
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);


  // Add servos to pins 12 and 13
  servoRight.attach(12); 
  servoLeft.attach(11);

 
}
void loop() {

  char c;
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
    case 'S':
      STOP();
      break;
  }
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

void distance(){
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
  bt.print("{'distance': '");
  bt.print(cm);
  bt.print("'}");
}


void left(){
    bt.println("{'direction': 'left'}");
    servoLeft.writeMicroseconds(1200);         // Left wheel clockwise
    servoRight.writeMicroseconds(1200);        // Right wheel clockwise
    delay(400);
   servoLeft.writeMicroseconds(1500);         // stop left
   servoRight.writeMicroseconds(1500);
}

void right(){
    bt.println("{'direction': 'right'}");
    servoLeft.writeMicroseconds(1700);         // Left wheel counterclockwise
    servoRight.writeMicroseconds(1700);        // Right wheel counterclockwise
    delay(400); // 0.4 seconds
    servoLeft.writeMicroseconds(1500);         // stop left
   servoRight.writeMicroseconds(1500);    
}
void STOP(){
   bt.println("{'direction': 'stop'}");
   servoLeft.writeMicroseconds(1500);         // stop left
   servoRight.writeMicroseconds(1500);  
}
void forward(){
    //poll compass
    compass();
    bt.println("{'direction': 'forward'}");
    servoLeft.writeMicroseconds(1700);         // Left wheel counterclockwise
    servoRight.writeMicroseconds(1200);
    delay(500); // 0.4 seconds
    servoLeft.writeMicroseconds(1500);         // stop left
   servoRight.writeMicroseconds(1500);// Right wheel clockwise
    
}

void reverse(){
    bt.println("{'direction': 'backwards'}");
    servoLeft.writeMicroseconds(1200);         // Left wheel clockwise
    servoRight.writeMicroseconds(1700); 
    delay(500); // 0.4 seconds
    servoLeft.writeMicroseconds(1500);         // stop left
   servoRight.writeMicroseconds(1500);// Right wheel counterclockwise
   }
