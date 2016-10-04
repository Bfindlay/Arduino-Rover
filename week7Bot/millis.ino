unsigned long time;

#include <Servo.h>                 
Servo servoRight;
Servo servoLeft;


   /******* RANGEFINDER **********/
int trigPin = 8;    //Trig - green Jumper
int echoPin = 9;    //Echo - yellow Jumper
long duration, cm;

void setup()                           
{
  //Trigger and echo pins for the ultrasonic sensor
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
    pinMode(7, INPUT);
    pinMode(4, OUTPUT);
    pinMode(5, INPUT);
    servoRight.attach(12); 
    servoLeft.attach(13);
    Serial.begin(9600);
 
    
}

void loop(){ 


time = millis();





  if(time< 10000){
    forward();
  
  }

  Serial.println(time);

  servoRight.writeMicroseconds(1500);
  servoLeft.writeMicroseconds(1500);
  
}


void backward(int duration){


  
 for(int i = 0; i < duration; i++){
  
    
    time++;
    servoRight.writeMicroseconds(1600);
    servoLeft.writeMicroseconds(1400);
  }

  
}



void forward(){

    servoRight.writeMicroseconds(1400);
    servoLeft.writeMicroseconds(1600);
 
}
void right(){
  Serial.println("RIGHT");
  tone(4, 900,500);
  backward(500);
  servoRight.writeMicroseconds(1600);
  servoLeft.writeMicroseconds(1600);
  delay(600);
}

void left(){ 

    Serial.print("NOT RIGHT");
    tone(4,1200,500);
    backward(500);
    servoRight.writeMicroseconds(1400);
    servoLeft.writeMicroseconds(1400);
    delay(600);

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
 return cm;
}

