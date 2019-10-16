void setup() {
  // put your setup code here, to run once:

  Serial.begin(9600);

}

void loop() {
  // put your main code here, to run repeatedly:

  float T = random(18, 25);
  float H = random(25, 42);

  String msg = "{\"T\":" + String(T) + "," + "\"H\":" + String(H) + "}";

  Serial.println(msg);
  delay(30000);

}
