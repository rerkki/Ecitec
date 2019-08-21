
#include <SPI.h>
#include <WiFi.h>
 
char ssid[] = "############"; //  your network SSID (name)
char pass[] = "############"; // your network password

int status = WL_IDLE_STATUS;

// Initialize the Wifi client library
WiFiClient client;

// ThingSpeak Settings
char server[] = "api.thingspeak.com";
String writeAPIKey = "9_______________H";

unsigned long lastConnectionTime = 0; // track the last connection time
const unsigned long postingInterval = 15L * 1000L; // post data every 20 seconds


void start_wifi() {
  // attempt to connect to Wifi network
  while ( status != WL_CONNECTED) {
    // Connect to WPA/WPA2 Wi-Fi network
    status = WiFi.begin(ssid, pass);
    Serial.println("wifi started");

    // wait 10 seconds for connection
    delay(5000);
  }
}
  
void setup() {
Serial.begin(9600);
}

//void(* resetFunc) (void) = 0;

void loop() {

float val1_ = analogRead(34);
float val2_ = analogRead(35);
Serial.println(val1_);
Serial.println(val2_);
  if (millis() - lastConnectionTime > postingInterval) {
    Serial.println("sending");
    start_wifi();
    delay(10);
    httpRequest(val1_, val2_);
    WiFi.disconnect();
   // resetFunc();
  }

}

void httpRequest(float val1, float val2) {
 
  // create data string to send to ThingSpeak
  String sensorValue1 = String(val1);
  String sensorValue2 = String(val2);
  String data = String("field1=" + sensorValue1 + "&field2=" + sensorValue2); 
  Serial.println(data);
  delay(100);

  // note the last connection time
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
    delay(300);
  }
}



