int trigPin = 8;    //Trig - green Jumper
int echoPin = 9;    //Echo - yellow Jumper
long duration, cm;
void setup() {
  
  Serial.begin(9600);
  pinMode(13,OUTPUT);
  pinMode(12,OUTPUT);
  pinMode(11,OUTPUT);
  pinMode(10,OUTPUT);

  //Trigger and echo pins for the ultrasonic sensor
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  //testing the methods
  blinkAll();
 
}

void loop() {
  //Check and log distance to serial
  distance();
 if (Serial.available() > 0) {
   char input = Serial.read();  // read first available byte into a variable
   if (input == 'L') {          // compare it and invoke appropriate function
      left();
   }else if(input == 'R'){
      right();
   }else if(input == 'B'){
      reverse();
   }else if(input == 'F'){
      forward();
   }
  }
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

void left(){
   digitalWrite(13, HIGH);
    //Serial.print("1");
    delay(1000);
    digitalWrite(13,LOW);
}

void right(){
   digitalWrite(12, HIGH);
    //Serial.print("1");
    delay(1000);
    digitalWrite(12,LOW);
}

void forward(){
   digitalWrite(11, HIGH);
    Serial.print("D42");
    delay(1000);
    digitalWrite(11,LOW);
}

void reverse(){
   digitalWrite(10, HIGH);
    //Serial.print("1");
    delay(1000);
    digitalWrite(10,LOW);
}

