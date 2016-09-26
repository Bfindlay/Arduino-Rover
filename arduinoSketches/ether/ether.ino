/**** BLUETOOTH SETUP ****/
#include <SoftwareSerial.h>                     // Software Serial Port

#define RxD 7
#define TxD 6

#define DEBUG_ENABLED  1

// Make sure you modify this address to the one in your Slave Device!!
String slaveAddr = "98,D3,34,90,A8,1A";
SoftwareSerial blueToothSerial(RxD,TxD);

/*****************************/


void setup() {
  
  Serial.begin(9600);

  /*** Bluetooth setup *******************************/
  pinMode(RxD, INPUT);
  pinMode(TxD, OUTPUT);
  blueToothSerial.begin(38400);

  /*****************************************************/
 
  pinMode(13,OUTPUT);
  pinMode(12,OUTPUT);
  pinMode(11,OUTPUT);
  pinMode(10,OUTPUT);

  //testing the methods
  blinkAll();
 
}





void loop() {

  //Test sending bluetooth command to slave
  blueToothSerial.write("Hello");
  digitalWrite(12, HIGH);
  delay(2000);
  digitalWrite(12, LOW);
 if (Serial.available() > 0) {
   char input = Serial.read();  // read first available byte into a variable

    // THis is where we retrieve the data from the server,
    //Then send it to the rover via bluetooth
  
     blueToothSerial.write(input);
  }

  /******* READ BLUETOOTH SERIAL ******/
  if(blueToothSerial.available()){

      //THis will be where we handle the response from the rover
      
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
    Serial.print("<left>");
    delay(1000);
    digitalWrite(13,LOW);
}

void right(){
  Serial.print("right");
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

