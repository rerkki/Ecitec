// This #include statement was automatically added by the Particle IDE.
#include <MQTT.h>

// This #include statement was automatically added by the Particle IDE.
#include <Adafruit_DHT_Particle.h>

#define DHTPIN 2 //Digital pin 2

// Uncomment whatever type you're using!
//#define DHTTYPE DHT11    // DHT 11 
#define DHTTYPE DHT21   // DHT 21 (AM2302)

//This is needed only if you use data transmission via HiveMQ
MQTT client("broker.hivemq.com", 1883, callback);

String ID = "1"; // Every device must have different ID

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  client.connect("");
  dht.begin();
}

void loop() {

  //Data will be sent via Particle.io MQTT Broker.
  //Particle.publish("Metropolia", PubStr);
  
  //Data will be sent vai HiveMQ MQTT Broker
  if (client.isConnected()) {
      
      delay(10000);
      float h = dht.getHumidity();
      float t = dht.getTempCelcius();
      float dp = t - (100 - h)/5;

      String PubStr = "{\"ID\":" + ID + "," + "\"H\":" + String(h) + "," + "\"T\":" + String(t) + "," + "\"DP\":" + String(dp) + "}";
      //This string sends data to HiveMQ
      client.publish("Metropolia", PubStr);
      
      //This sends data to Particle.io Cloud
      Particle.publish("Metropolia", PubStr);
      
      client.loop();
  }
  
}

void callback(char* topic, byte* payload, unsigned int length) {}
