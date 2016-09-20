#include <SoftwareSerial.h>   //Software Serial Port

#define RxD 7
#define TxD 6
#include <Servo.h>                 
Servo servoRight;
Servo servoLeft;
String content = "";
char character;
#define DEBUG_ENABLED  1

SoftwareSerial blueToothSerial(RxD,TxD);
void setupBlueToothConnection()
{
  //Set BluetoothBee BaudRate to default baud rate 38400
  blueToothSerial.begin(38400);
  //set the bluetooth work in slave mode
  blueToothSerial.print("\r\n+STWMOD=0\r\n");
  //set the bluetooth name (irrelevant)
  blueToothSerial.print("\r\n+STNA=SlaveBob\r\n"); 
  // Permit Paired device to connect me
  blueToothSerial.print("\r\n+STOAUT=1\r\n");
  // Auto-connection is not allowed
  blueToothSerial.print("\r\n+STAUTO=0\r\n"); 
  delay(2000); // This delay is required.
  //make the slave bluetooth inquirable 
  blueToothSerial.print("\r\n+INQ=1\r\n");
  delay(2000); // This delay is required.
}

void forward(){

  servoRight.writeMicroseconds(1400);
  servoLeft.writeMicroseconds(1600);
}

void STOP(){
  servoRight.writeMicroseconds(1500);
  servoLeft.writeMicroseconds(1500);
}
void backwards(){
  servoRight.writeMicroseconds(1600);
  servoLeft.writeMicroseconds(1400);
  delay(500);
}

void left(){
  servoRight.writeMicroseconds(1700);
  servoLeft.writeMicroseconds(1600);
   delay(400);
   servoRight.writeMicroseconds(1500);
   servoLeft.writeMicroseconds(1500);
}

void right(){ 
    servoRight.writeMicroseconds(1600);
    servoLeft.writeMicroseconds(1700);
    delay(400);
     servoRight.writeMicroseconds(1500);
    servoLeft.writeMicroseconds(1500);

}

void setup() 
{ 
  Serial.begin(9600);
  pinMode(RxD, INPUT);
  pinMode(TxD, OUTPUT);
  setupBlueToothConnection();
  //wait 1s and flush the serial and btooth buffers
  delay(1000);
  Serial.flush();
  blueToothSerial.flush();

  pinMode(10, INPUT);  pinMode(9, OUTPUT);   // Left IR  Receiver && IR LED
  pinMode(3,INPUT); pinMode(2, OUTPUT);       //Right IR Receiver & IR LED
    

//bot commands
pinMode(7, INPUT);
    pinMode(4, OUTPUT);
    pinMode(5, INPUT);
    servoRight.attach(12); 
    servoLeft.attach(13);
} 

int irDetect(int irLedPin, int irReceiverPin, long frequency)
{
  tone(irLedPin, frequency, 8);              // IRLED 38 kHz for at least 1 ms
  delay(1);                                  // Wait 1 ms
  int ir = digitalRead(irReceiverPin);       // IR receiver -> ir variable
  delay(1);                                  // Down time before recheck
  return ir;                                 // Return 1 no detect, 0 detect
}
void check(){
  int irLeft = irDetect(9, 10, 38000);       // Check for object
  int irRight = irDetect(2, 3, 38000);
   if(irLeft == 0 &&irRight != 0){
    right();
    Serial.println("turning right");
    
  }
  else if(irLeft != 0 && irRight == 0){
    left();
    Serial.println("turning right");
  }else if(irLeft == 0 && irRight == 0){
    backwards();
    Serial.println("Going backward");
  }
  forward();
}
void loop() { 
  
  char r;
    check();
    // If there is data ready in the btooth
    if(blueToothSerial.available()) {
      r = blueToothSerial.read();
      if(r == 'w'){
        Serial.print("FORWARDS");
         blueToothSerial.print(r);
        forward();
      }else if( r == 'a'){
            Serial.print("left");
            left();
      }else if( r == 'd'){
        Serial.print("right");
        right();
      }else if( r == 's'){
        Serial.print("backwards");
        backwards();
      }else if(r == 't'){
        Serial.print("stop");
        STOP();
      }
     }
   }






