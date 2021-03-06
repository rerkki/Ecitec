
const mqtt = require('mqtt');
const broker = 'mqtt://broker.hivemq.com:1883';
const user = '';
const pw = '';
const MongoClient = require('mongodb').MongoClient;
var msg = 0;

var myCollection;
var db;
var obj_m;
var objArr = [];

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
  setTimeout(function() {
    console.log(objArr);
    console.log(objArr.length);
	if(objArr.length > 0) {
  	  createConnection(function(){
	     console.log(objArr.length);
  		  addDocument(function(){
		  });
  	    });
         }
   },500)
}

mq.on('connect', function(err) {
  setInterval(function(){pub_index()},900000)
})

mq.on('message', function(topic, message) {
  obj = JSON.parse(message);
  console.log(obj);
  msg +=1;
  obj_m = {Group: obj.ID, Time: obj.Time, T: Number(obj.T.toFixed(1)), H: Number(obj.H.toFixed(1))};
  objArr[msg-1]= obj_m;
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

function createConnection(onCreate){
    MongoClient.connect('mongodb+srv://metropolia:metropolia@cluster0-fn7gd.gcp.mongodb.net/UrbanFarm?retryWrites=true&w=majority', function(err, client_m) {
	db = client_m.db('UrbanFarm');
	   if(err)
              throw err;
	   console.log("connected to the mongoDB !");
	   console.log(obj.ID);
	   myCollection = db.collection('UrbanFarm');
	   onCreate();
	   client_m.close();
    });
}

function addDocument(onAdded){
      myCollection.insertMany(objArr, function(err, result) {
          if(err)
              throw err;
          console.log("entry saved");
	        objArr = [];
          msg = 0;
          onAdded();
      });
}
