#include <Adafruit_DHT_Particle.h>
#include "MQTT.h"

#define DHTPIN 2 //Digital pin 2

// Uncomment whatever type you're using!
//#define DHTTYPE DHT11    // DHT 11 
#define DHTTYPE DHT21   // DHT 21 (AM2302)

String ID = "1"; // Jokaiselle ryhmälle oltava eri ID

DHT dht(DHTPIN, DHTTYPE);

void callback(char* topic, byte* payload, unsigned int length);

MQTT client("broker.hivemq.com", 1883, callback);

// recieve message
void callback(char* topic, byte* payload, unsigned int length) {
    
    char p[length + 1];
    memcpy(p, payload, length);
    p[length] = NULL;

  float h = dht.getHumidity();
  float t = dht.getTempCelcius();

  String PubStr = "{\"Time\":" + String(p) + "," + "\"H\":" + String(h) + "," + "\"T\":" + String(t) + "," + "\"ID\":" + ID + "}";
    client.publish("urbanFarm/data", PubStr);
}


void setup() {
    dht.begin();

    client.connect("");

    if (client.isConnected()) {
        client.subscribe("urbanFarm/request");
    }
    
}

void loop() {
    if (client.isConnected())
        client.loop();
}
