//This file is for testing the mqtt_mongo client without RPi & DHT
//The script generates pseudo-data which can be subscribed from HiveMQ broker

const mqtt = require('mqtt');
const broker = 'mqtt://broker.hivemq.com:1883';
const user = '';
const pw = '';

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

function random(low, high) {
  return Math.random() * (high - low) + low
}

function pub_index(){
  var t = random(10,30);
  var h = random(20,90);
  var dp = t - (100 - h)/5;
  var obj = { Time: timeConverter(Date.now()), T: t, H: h, DP: dp };
  var obj_str = JSON.stringify(obj);
  console.log(obj);
  mq.publish('DHT_data2', obj_str);
};

mq.on('connect', function () {
  setInterval(function(){pub_index()},3000)
})

if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}
