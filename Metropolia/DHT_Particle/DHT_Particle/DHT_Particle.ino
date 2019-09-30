// This #include statement was automatically added by the Particle IDE.
#include <Adafruit_DHT_Particle.h>

#define DHTPIN 2 //Digital pin 2

// Uncomment whatever type you're using!
//#define DHTTYPE DHT11    // DHT 11 
#define DHTTYPE DHT21   // DHT 21 (AM2302)

String ID = "1"; // Jokaiselle ryhmälle oltava eri ID

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600); 
  Serial.println("DHTxx test!");
  dht.begin();
}

void loop() {

  delay(10000);
  float h = dht.getHumidity();
  float t = dht.getTempCelcius();


  if (isnan(h) || isnan(t)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  String PubStr = "{\"H\":" + String(h) + "," + "\"T\":" + String(t) + "," + "\"ID\":" + ID + "}";

  Particle.publish("UrbanFarm", PubStr);
  
}
