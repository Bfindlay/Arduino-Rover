#include <SoftwareSerial.h>                     // Software Serial Port

#define RxD 2
#define TxD 3
SoftwareSerial bt(RxD,TxD);
void setup() {
  pinMode(12, OUTPUT);
  Serial.begin(9600);
  bt.begin(38400); // Default communication rate of the Bluetooth module
}
void loop() {
 if(bt.available() > 0){ // Checks whether data is comming from the serial port
    digitalWrite(12,HIGH);
 }
 
 if (9  == HIGH) {
   Serial.println('1'); // Sends '1' to the master to turn on LED
 }
 else {
   Serial.println('0');
 }  
}
