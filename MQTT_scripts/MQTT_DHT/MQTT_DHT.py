#!/usr/bin/python
import sys
import time
#import Adafruit_DHT #uncomment this line if you have DHT sensor connected to RPi
import paho.mqtt.client as mqtt
import datetime
import re

broker_address="broker.hivemq.com"
client = mqtt.Client()
#client.connect(broker_address)

id = "1" # an identifier for your RPi

def on_connect(client, userdata, flags, rc):
    client.subscribe('request/#')
    print("Connected")
    
def on_message(client, userdata, msg):
    print(msg.payload)
#    humidity, temperature = Adafruit_DHT.read_retry(11, 4) #uncomment this line if you have DHT sensor connected to RPi
    humidity = 22 #comment this line if you have DHT sensor connected to RPi
    temperature = 65 #comment this line if you have DHT sensor connected to RPi
    req = re.findall('\d+', str(msg.payload))[0]
    timestamp = datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S")

    msg2 = '{{"Req": {},"Time": "{}","ID": {},"T":{:0.1f}, "H":{:0.1f}}}'.format(req, timestamp, id, temperature, humidity)
    
    client.publish("DHT_data", msg2)
    print(msg2)
    
    
client.on_connect = on_connect
client.on_message = on_message
client.connect(broker_address)


try:
    client.loop_forever()
except:
    print("error")
