
#include <SPI.h>
#include <OneWire.h>
#include <DallasTemperature.h>

#include <SPI.h>
#include <WiFi101.h>

#define ONE_WIRE_BUS 8
 
char ssid[] = "SONERAINTERNET"; //  your network SSID (name)
char pass[] = "O_____________3"; // your network password

int status = WL_IDLE_STATUS;

// Initialize the Wifi client library
WiFiClient client;

// ThingSpeak Settings
char server[] = "api.thingspeak.com";
String writeAPIKey = "N____________P";

unsigned long lastConnectionTime = 0; // track the last connection time
const unsigned long postingInterval = 20L * 1000L; // post data every 20 seconds

OneWire oneWire(8);
DallasTemperature sensors(&oneWire);

//You need to identify the unique addresses of your onewire thermometers, your sensors do not work with the addresses below...
DeviceAddress Thermometer1 = { 0x28, 0xFF, 0x41, 0x06, 0xA3, 0x17, 0x04, 0x94 };
DeviceAddress Thermometer2 = { 0x28, 0xFF, 0x04, 0x14, 0xA3, 0x17, 0x04, 0x90 };

float get_temperature(DeviceAddress deviceAddress)
{
  float tempC = sensors.getTempC(deviceAddress);
  return tempC;
}

void start_wifi() {
  // attempt to connect to Wifi network
  while ( status != WL_CONNECTED) {
    // Connect to WPA/WPA2 Wi-Fi network
    status = WiFi.begin(ssid, pass);
    Serial.println("wifi started");

    // wait 10 seconds for connection
    delay(30000);
  }
}
  
void setup() {

  sensors.begin();
  sensors.setResolution(Thermometer1, 12);
  sensors.setResolution(Thermometer2, 12);
}

void(* resetFunc) (void) = 0;

void loop() {
  // if interval time has passed since the last connection,
  // then connect again and send data
//  if (millis() - lastConnectionTime > postingInterval) {
    Serial.println("sending");
    start_wifi();
    httpRequest();
    //WiFi.end();
    resetFunc();
//  }

}

void httpRequest() {
 
  // create data string to send to ThingSpeak
  //sensors.requestTemperatures();
  String sensorValue1 = String(get_temperature(Thermometer1));
  String sensorValue2 = String(get_temperature(Thermometer2));
  String data = String("field1=" + sensorValue1 + "&field2=" + sensorValue2); 
  Serial.println(data);

  // last connection time
  lastConnectionTime = millis();
  
  // close any connection before sending a new request
  //client.stop();

  // POST data to ThingSpeak
  if (client.connect(server, 80)) {
    client.println("POST /update HTTP/1.1");
    client.println("Host: api.thingspeak.com");
    client.println("Connection: close");
    client.println("User-Agent: ArduinoWiFi/1.1");
    client.println("X-THINGSPEAKAPIKEY: "+writeAPIKey);
    client.println("Content-Type: application/x-www-form-urlencoded");
    client.print("Content-Length: ");
    client.print(data.length());
    client.print("\n\n");
    client.print(data);
    client.stop();
    Serial.println("data sent");
  }
}



