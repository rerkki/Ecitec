void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
}

void loop() 
{
 float a = analogRead(A0);

  //print to serial port
  //String serial_port_str = String("analogPort: " + String(a));
  //Serial.println(serial_port_str); 

  //print to serial plotter
  //Serial.print(a);

  //print JSON string
  Serial.print("{\"analogPort\":");
  Serial.print(a);
  Serial.println("}");

   delay(2000);
}
