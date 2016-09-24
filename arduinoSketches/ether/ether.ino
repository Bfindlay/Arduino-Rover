
void setup() {
  // initialize serial communication at 9600 bits per second:
  
  Serial.begin(9600);
  pinMode(13,OUTPUT);
  pinMode(12,OUTPUT);
  pinMode(11,OUTPUT);
  pinMode(10,OUTPUT);

  blinkAll();
 
}

void loop() {

 if (Serial.available() > 0) {
   char input = Serial.read();  // read first available byte into a variable
   if (input == 'L') {          // if the variable equals H, or ASCII 72
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
    Serial.print("1");
    delay(1000);
    digitalWrite(11,LOW);
}

void reverse(){
   digitalWrite(10, HIGH);
    //Serial.print("1");
    delay(1000);
    digitalWrite(10,LOW);
}

