
var mqtt    = require('mqtt');
var mq  = mqtt.connect('mqtt://broker.mqttdashboard.com:1883',{});
var MongoClient = require('mongodb').MongoClient;

var myCollection;
var db;
var obj;
var i = 0;

mq.on('connect', function(){
    console.log('Connected');
    setInterval(function(){pub_index()},15000)
});

function pub_index(){
  mq.publish('opiframe3/request/ID2', i.toString());  //CHANGE CORRECT ID#
  i +=1;
  console.log(i);
};

mq.subscribe('opiframe3/data/ID2'); //CHANGE CORRECT ID#

mq.on('message', function(topic, message) {
  console.log(message.toString('utf8'));
  obj = JSON.parse(message);
  console.log(obj);
	createConnection(function(){
    		addDocument(function(){
		});
	});
});

function createConnection(onCreate){
  //CHANGE YOUR OWN connection string (get it from Mongo Atlas)
  //CHECK YOU HAVE CORRECT DB (e.g. mongotest)
    MongoClient.connect('mongodb+srv://opiframe:opiframe@cluster0-pn4gb.gcp.mongodb.net/mongotest?retryWrites=true&w=majority', function(err, client_m) {
        db = client_m.db('mongotest'); // DB also here
	if(err)
            throw err;
        console.log("connected to the mongoDB !");
        myCollection = db.collection('DHT_data'); //Collection can be DHT_data or any name
        onCreate();
	client_m.close();
    });
}

function addDocument(onAdded){
    myCollection.insert({Time: timeConverter(Date.now()), obj}, function(err, result) {
        if(err)
            throw err;
        console.log("entry saved");
        onAdded();
    });
}

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
