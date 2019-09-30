#include "DHT.h"
#define DHTPIN 12    // modify to the pin we connected
 
#define DHTTYPE DHT11   // DHT11 
 
DHT dht(DHTPIN, DHTTYPE);
 
void setup() 
{
 Serial.begin(9600); 
 dht.begin();
}
 
void loop() 
{
 float h = dht.readHumidity();
 float t = dht.readTemperature();
 if (isnan(t) || isnan(h)) 
 {
   Serial.println("DHT failed...");
 } 
 else 
 {
  //print to serial port
  //String serial_port_str = String("Humidity: " + String(h) + " % " + "     Temperature: " + String(t) + " C");
  //Serial.println(serial_port_str); 

  //print to serial plotter
  //Serial.print(h);
  //Serial.print(" ");
  //Serial.println(t);

  //print JSON string
  
  Serial.print("{\"H\":");
  Serial.print(h);
  Serial.print(",");
  Serial.print("\"T\":");
  Serial.print(t);
  Serial.println("}");
  

   delay(2000);
 }
}

