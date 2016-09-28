/**** BLUETOOTH SETUP ****/
#include <SoftwareSerial.h>                     // Software Serial Port


#define DEBUG_ENABLED  1


SoftwareSerial bt(2,3);  //TX | RX

/*****************************/


void setup() {
  
  Serial.begin(9600);

  /*** Bluetooth setup *******************************/

  // 2 TX
  // 3 RX
  pinMode(2, INPUT);
  pinMode(3, OUTPUT);
  bt.begin(57600);

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

    //Receive from server
   if (Serial.available()) {
    char input = Serial.read();  // read first available byte into a variable
    // THis is where we retrieve the data from the server,
    //Then send it to the rover via bluetooth
     bt.print(input);
     //Serial.print('h');
  }
  

  /******* READ BLUETOOTH SERIAL ******/
  if(bt.available()){
     //THis will be where we handle the response from the rover
      char r = bt.read();
      //send rover response to server
      Serial.println(r);
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



