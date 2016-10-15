# Arduino-Rover

## ELEC1601 Project

This project allows an arduino rover to be controlled via a websocket/serial connection to a nodejs server and a web page
![alt tag](https://dl.dropboxusercontent.com/u/14297267/project.png)

## Usage

Clone the project
```bash
git clone 
```

Change to the server directory
```bash
cd server/
```
Install dependencies 
```bash
npm install
```
Start the server
```bash
npm start
```
Visit the webpage on localhost:3000 and choose your arduino COM port and you're ready to go!

## Project info
  Problem to solve.
    1. Navigate unknown terrin, Based off a roomba, Self-driving car?

    
  1. Need an actuator
  

## Documentation
Bluetooth defined as bt
Pins;
  2 - TX
  3 - RX
  
Servo
  Right | servoRight | Pin 12
  Left | servoLeft | Pin 13
  
Ultrasonic sensor
  Pin;
  Trigger - 8
  Echo - 9;
  
  Other Variables
  long - duration, cm
  
Infrared sensors
  Pin;
  Left | 00
  Right | 00
  Back | 00
  Front | 00
  
  Variables
  frontIR, backIR, rightIR, leftIR | Object detection | 0 or 1
 
Other Variables
 boolean flag = false; //Ued to swictch between Manual control and Automated Control

Methods
void setup()
  1. Initalise the compass
  2. Initalise bluetooth connection
  3. Initaslise ultrasonic sensor.
  4. Attach Servos.
  
void loop()
  Used for manual control
  1. Check for bluetooth receive, if present, read data as a character.
  2. Switch case for robot control.
  
void autoMode()
  Used for automated control
  Loops while flag is true;
  1. Automatic navigation
  2. Check if bt data is received, if so, read and check if flag should be overwritten.
 
int irDetect()
  Used for edge detection
  1. Return a 0 or 1.
  
void compass()
  Self explanatory.
  
void distance()
  Returns distance from ultrasonic sensor.

void left()
void right()
void forward()
void reverse()
`
