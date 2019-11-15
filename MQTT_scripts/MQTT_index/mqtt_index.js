const ﻿mqtt = require('mqtt');
const broker = 'mqtt://broker.hivemq.com:1883';
const user = '';
const pw = '';

var i = 0;

mq = mqtt.connect(broker, {
  'username': user,
  'password': pw
});

mq.on('error', function(err) {
  return console.log("mq err", err);
});

mq.on('connect', function(err) {
  return console.log("mq connected----------");
});

mq.on('reconnect', function(err) {
  return console.log("mq_pub reconnected");
});

function pub_index(){
  mq.publish('opiframe3/request/ID0', i.toString());
  i +=1;
};

mq.on('connect', function () {
  setInterval(function(){pub_index()},30000)
})
