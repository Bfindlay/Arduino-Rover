#include <Servo.h>                 
Servo servoRight;
Servo servoLeft;

void setup()                           
{
    pinMode(7, INPUT);
    pinMode(4, OUTPUT);
    pinMode(5, INPUT);
    servoRight.attach(12); 
    servoLeft.attach(13);
    Serial.begin(9600);
    
}

void loop(){ 
  Serial.print(digitalRead(5));
  Serial.println(digitalRead(7));
  forward();
  if(digitalRead(7) == LOW){
    left();
  }
  else if(digitalRead(5) == LOW){
    right();
  }else if(digitalRead(5) == LOW && digitalRead(6) == LOW){
    backwards();
  }

}

void backwards(){
  servoRight.writeMicroseconds(1600);
  servoLeft.writeMicroseconds(1400);
  delay(500);
}
void forward(){

  servoRight.writeMicroseconds(1400);
  servoLeft.writeMicroseconds(1600);
}
void right(){
  Serial.println("RIGHT");
  tone(4, 900,500);
  backwards();
  servoRight.writeMicroseconds(1600);
  servoLeft.writeMicroseconds(1600);
  delay(600);
}

void left(){ 

    Serial.print("NOT RIGHT");
    tone(4,1200,500);
    backwards();
    servoRight.writeMicroseconds(1400);
    servoLeft.writeMicroseconds(1400);
    delay(600);

}

