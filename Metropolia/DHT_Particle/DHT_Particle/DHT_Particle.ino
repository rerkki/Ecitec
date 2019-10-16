
#include <Adafruit_DHT_Particle.h>
#include "MQTT.h"

#define DHTPIN 2 //Digital pin 2

// Uncomment whatever type you're using!
//#define DHTTYPE DHT11    // DHT 11 
#define DHTTYPE DHT21   // DHT 21 (AM2302)

String ID = "1"; // Jokaiselle ryhmälle oltava eri ID

unsigned long start;

DHT dht(DHTPIN, DHTTYPE);

void callback(char* topic, byte* payload, unsigned int length);

MQTT client("broker.hivemq.com", 1883, callback);

int Alive(String data) {
    Particle.publish("alive", "...and kicking!");
    return 1;
}

// recieve message
void callback(char* topic, byte* payload, unsigned int length) {
    
    char p[length + 1];
    memcpy(p, payload, length);
    p[length] = NULL;

  float h = dht.getHumidity();
  float t = dht.getTempCelcius();

  String PubStr = "{\"Time\":" + String(p) + "," + "\"H\":" + String(h) + "," + "\"T\":" + String(t) + "," + "\"ID\":" + ID + "}";
    client.publish("Opiframe/data", PubStr);

}


void setup() {
    Particle.function("Alive", Alive);
    start = millis();
    dht.begin();

    client.connect("");

    if (client.isConnected()) {
        client.subscribe("Opiframe/request");
    }
    
}

void loop() {
    
    if(millis() - start > 1800000) System.reset();
    if (client.isConnected()) client.loop();
        
}
