#include <SoftwareSerial.h>                     // Software Serial Port

#define RxD 7
#define TxD 6

#define DEBUG_ENABLED  1

// Make sure you modify this address to the one in your Slave Device!!
String slaveAddr = "0,6A,8E,16,C4,AA";

SoftwareSerial blueToothSerial(RxD,TxD);

void setup()
{
  Serial.begin(9600);
  pinMode(RxD, INPUT);
  pinMode(TxD, OUTPUT);
  //wait 1s and flush the serial and btooth buffers
  delay(1000);
  Serial.flush();
  blueToothSerial.flush();
}

void loop()
{
  char recvChar;

  // Infinite loop
  while(1)
  {
    // If there is data pending to be read from the shield
    if(blueToothSerial.available())
    {
      recvChar = blueToothSerial.read();
      // Print the data through the Serial channel
      Serial.print("Master Received: ");
      Serial.print(recvChar);
      Serial.print("\n");
    }
    // If there is data pending to be read from the serial port
    if(Serial.available())
    {
      recvChar  = Serial.read();
      // Send the data through btooth
      blueToothSerial.print(recvChar);
      Serial.print("Master Transmitted: ");
      Serial.print(recvChar);
      Serial.print("\n");
    }
  }
}
// Function to start the connection. Make sure slaveAddr is set to the right
// value.

