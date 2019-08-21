#include <SPI.h>
#include "nRF24L01.h"
#include "RF24.h"
#include "printf.h"

#define channel        0x4c                  // nrf24 communication channel
#define writingPipe1   0xF0F0F0F0E1LL        // nrf24 communication address
#define writingPipe2   0xF0F0F0F0D2LL
#define writingPipe3   0xF0F0F0F0C3LL
#define writingPipe4   0xF0F0F0F0A4LL
#define writingPipe5   0xF0F0F0F0B5LL
#define dataRate       RF24_250KBPS          // nrf24 data rate (lower == more distance)
#define paLevel        RF24_PA_HIGH          // nrf24 power level

RF24 radio(9,10);

char receive_payload[12]; 
char send_payload[12]; 

////////CONFIGURE THESE FOR EACH NODE///////////////////////////////
char role = 'R'; // T for Transmitter(slave), R for Receiver(master)
String slaveID = "2";    //Slave node ID (1 - 5)


void setup(void) {
  pinMode(7, OUTPUT);  //Additional digital output
  
  Serial.begin(57600);
  printf_begin();

  radio.begin();
  radio.setRetries(15,15);
  radio.setPALevel(paLevel);
  radio.setChannel(channel);
  radio.enableDynamicPayloads();
  radio.setDataRate(dataRate);
  radio.setAutoAck(false);
  
  
  /////////Open pipes 1 - 5 for reading (master receives from slaves)
  radio.openReadingPipe(1, writingPipe1);
  radio.openReadingPipe(2, writingPipe2);
  radio.openReadingPipe(3, writingPipe3);
  radio.openReadingPipe(4, writingPipe4);
  radio.openReadingPipe(5, writingPipe5);

  /////////Open pipes 0 - 4 for writing (slaves send to master)
  if(slaveID=="1") radio.openWritingPipe(writingPipe1);
  if(slaveID=="2") radio.openWritingPipe(writingPipe2);
  if(slaveID=="3") radio.openWritingPipe(writingPipe3);
  if(slaveID=="4") radio.openWritingPipe(writingPipe4);
  if(slaveID=="5") radio.openWritingPipe(writingPipe5);
  radio.startListening();

//  radio.printDetails();
  
  delay(500);
}

void loop(void) {
  
/////////////TRANSMITTER////////////

  if(role=='T'){
    radio.stopListening();   //Slave stops listening and begins to transmit to master
    String send_ = slaveID + ";" + analogRead(A0) + '\0'; //message to send
    send_.toCharArray(send_payload, 12);  // Convert string to array of chars
    bool ok = radio.write(&send_payload, 12);  //Send message
  
    if (ok)
      printf("ok...\n\r");  //OK if sending was successful
    else
      printf("failed.\n\r");
    
    delay(50);
    
    radio.startListening();  //Slave listens acknowledgement or instructions from master
  }




//////////////RECEIVER///////////////
 
   if(role=='R'){
    if (radio.available()) {
      
      uint8_t len;  // variable to determine message length
      bool done = false;
      
      while (!done) {  //wait for the message, and quit when something has been received
        len = radio.getDynamicPayloadSize();  //get the payload size from slave
        done = radio.read(receive_payload, len);  //read the message, OK when message has been received

        String payload = String(receive_payload) + '\0';
        int payload_val = payload.substring(2).toInt(); //payload_val is the numerical value coming from other node
        Serial.print(payload); Serial.print("  "); Serial.println(payload_val);
        
        ///////////////////////////////////////////////////////////////////////
        //todo: Write here conditions and actions based on the incoming value//
        ///////////////////////////////////////////////////////////////////////


      }
    }
   }
   
  delay(500);  //wait 500 ms before next trial
  
}
