
const mqtt = require('mqtt');
const broker = 'mqtt://broker.hivemq.com:1883';
const user = '';
const pw = '';

const MongoClient = require('mongodb').MongoClient;

var myCollection;
var db;
var obj;
var obj_1;
var obj_2;

mq = mqtt.connect(broker, {
  'username': user,
  'password': pw
});

mq.on('error', function(err) {
  return console.log("mq err", err);
});

mq.on('reconnect', function(err) {
  return console.log("mq_pub reconnected");
});

function pub_index(){
  mq.publish('urbanFarm/request', timeConverter(Date.now()).toString() );
};

mq.on('connect', function(err) {
  setInterval(function(){pub_index()},5000)
})

mq.on('message', function(topic, message) {
  obj = JSON.parse(message);
  console.log(obj);
  console.log(obj.ID);
  if(obj.ID==1) obj_1 = obj;
  if(obj.ID==2) obj_2 = obj;
  console.log(obj_1);
  console.log(obj_2);
    MongoClient.connect('mongodb+srv://eki:langistester@cluster0-fn7gd.gcp.mongodb.net/UrbanFarm?retryWrites=true&w=majority', function(err, client_m) {
	db = client_m.db('UrbanFarm');
	if(err) throw err;
	console.log("connected to the mongoDB !");
	console.log(obj.ID);
	myCollection = db.collection('UrbanFarm');
	myCollection.insertMany([obj_1,obj_2], function(err, result) {
        	if(err) throw err;
        	console.log("entry saved");
		client_m.close();
	});
    });
});

mq.subscribe('urbanFarm/data');

if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp);
  var year = a.getFullYear();
  var month = ("0" + (a.getMonth() + 1)).slice(-2);
  var date = ("0" + a.getDate()).slice(-2);
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = '\"' + year + '-' + month + '-' + date + ' ' + hour + ':' + min + ':' + sec + '\"';
  return time;
}

