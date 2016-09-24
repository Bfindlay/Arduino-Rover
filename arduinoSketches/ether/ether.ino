
void setup() {
  // initialize serial communication at 9600 bits per second:
  
  Serial.begin(9600);
  pinMode(13,OUTPUT);
}

void loop() {

 if (Serial.available() > 0) {
   char input = Serial.read();  // read first available byte into a variable
   if (input == 'H') {          // if the variable equals H, or ASCII 72
    digitalWrite(13, HIGH);
    Serial.print("1");
    delay(1000);
    digitalWrite(13,LOW);
    
   }
  }
}
