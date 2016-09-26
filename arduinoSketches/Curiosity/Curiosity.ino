#include <SoftwareSerial.h>                     // Software Serial Port


SoftwareSerial bt(2,3);  //TX | RX

int trigPin = 8;    //Trig - green Jumper
int echoPin = 9;    //Echo - yellow Jumper
long duration, cm;


void setup() {
 
  Serial.begin(9600);
  Serial.print("Ready!");
  
  pinMode(2, INPUT);
  pinMode(3, OUTPUT);
  bt.begin(9600); // Default communication rate of the Bluetooth module
  
  pinMode(13,OUTPUT);
  pinMode(12,OUTPUT);
  pinMode(11,OUTPUT);
  pinMode(10,OUTPUT);
  
  //Trigger and echo pins for the ultrasonic sensor
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  blinkAll(); 

 
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
  }
 }

}

void blinkAll(){
  digitalWrite(13, HIGH);
  digitalWrite(12, HIGH);
  digitalWrite(11, HIGH);
  digitalWrite(10, HIGH);

  delay(1000);
  digitalWrite(13,LOW);
  digitalWrite(12,LOW);
  digitalWrite(11,LOW);
  digitalWrite(10,LOW);

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
  
  Serial.print(cm);
  Serial.print("cm");
}


void left(){
    digitalWrite(13, HIGH);
    bt.write("llll");
    delay(1000);
    digitalWrite(13,LOW);
}

void right(){
    bt.write("rrrr");
    digitalWrite(12, HIGH);
    delay(1000);
    digitalWrite(12,LOW);
}

void forward(){
    digitalWrite(11, HIGH);
    bt.write("ffff");
    delay(1000);
    digitalWrite(11,LOW);
}

void reverse(){
    digitalWrite(10, HIGH);
    bt.print("bbbb");
    delay(1000);
    digitalWrite(10,LOW);
}

