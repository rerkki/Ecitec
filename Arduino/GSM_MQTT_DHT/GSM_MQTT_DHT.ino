#include <PubSubClient.h>
#include <dht.h>
#include <SPI.h>
#include <GSM.h>

dht DHT;
#define DHT21_PIN 8

// PIN number if necessary
#define PINNUMBER ""

// APN information obtained from your network provider
#define GPRS_APN "data.dna.fi" // replace with your GPRS APN
#define GPRS_LOGIN "" // replace with your GPRS login
#define GPRS_PASSWORD "" // replace with your GPRS password

// initialize the library instances
GSMClient client;
GPRS gprs;
GSM gsmAccess;

PubSubClient mqttClient(client);

String Incoming;
char incoming_str[50];

void callback(char* topic, byte* payload, unsigned int length) {
                
  Serial.print("message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i=0;i<length;i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
}

void setup()
{
  Serial.begin(9600);
  StartGSM(); 
  connect_broker();
}

unsigned long lastConn = millis();
  
void loop() {
  if (!mqttClient.connected()) {
    connect_broker();
  }
  
  if(millis() - lastConn > 15000) {
    publish_data(); 
    lastConn = millis();
    Serial.println();
  }
  
  mqttClient.loop();
}

void StartGSM() {

 Serial.println("starting GSM web client.");
 // connection state
 boolean notConnected = true;

 // Start GSM shield
  while(notConnected) {
    if((gsmAccess.begin(PINNUMBER)==GSM_READY) &
      (gprs.attachGPRS(GPRS_APN, GPRS_LOGIN, GPRS_PASSWORD)==GPRS_READY))
      notConnected = false;
    else {
    Serial.println("not connected");
    delay(1000);
    }
  }
}

void connect_broker() {

  char server[] = "broker.hivemq.com"; // the broker URL
  int port = 1883;

//  char server[] = "m20.cloudmqtt.com"; // the broker URL
//  int port = xxxxxx; // the port
  
//  char server[] = "mqtt.thingspeak.com"; // the broker URL
//  int port = 1883;
  
  Serial.print("connecting to broker...");
  mqttClient.setServer(server, port);
  mqttClient.setCallback(callback);

  while(!mqttClient.connected()) {

//    if(mqttClient.connect("myClientID", "YYYYYYYYYY", "XXXXXXXXX")) { //username and password
    if(mqttClient.connect("myClientID")) {

      Serial.println(" connected");
      // connection succeeded
      mqttClient.subscribe("testTopic/#");
    } else {
    // connection failed
    Serial.print("broker connection failed, rc=");
    Serial.print(mqttClient.state());// will provide more information on failure
    Serial.println(" try again in 5 seconds");
    delay(5000);
    }
  }
}

void publish_message() {
  if(mqttClient.connect("clientId-xxxxxxxxxx")) {
    mqttClient.publish("testTopic", "hello world");
    delay(5000);
  }
}

void publish_data() {  
    int chk = DHT.read21(DHT21_PIN);
    double temp = DHT.temperature;
    double humid = DHT.humidity;
    
    Serial.println("publishing...");
    
 //   String data = String("field1=" + String(temp) + "&field2=" + String(humid));

    String data = " {\"temperature\":" + String(temp) + ", " + "\"humidity\":" + String(humid) + "}\n " ;
//    delay(5000);

    int length = data.length();
                
    char msgBuffer[length];
    data.toCharArray(msgBuffer,length+1);
    Serial.println(msgBuffer);
    
    // Publish data to ThingSpeak. Replace <YOUR-CHANNEL-ID> with your channel ID and <YOUR-CHANNEL-WRITEAPIKEY> with your write API key
//    mqttClient.publish("channels/#CHANNEL_ID#/publish/#APIKEY#",msgBuffer);
    mqttClient.publish("testTopic", msgBuffer); //Publish data to HiveMq

}

