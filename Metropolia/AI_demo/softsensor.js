
const mqtt    = require('mqtt');
const broker = 'mqtt://broker.hivemq.com:1883';
const user = '';
const pw = '';

mq = mqtt.connect(broker, {
  'username': user,
  'password': pw
});

const MongoClient = require('mongodb').MongoClient;

var myCollection;
var db;
var client_m;
var obj;
var obj2;


mq.on('message', function(topic, message) {
  console.log(message.toString('utf8'));
  obj = JSON.parse(message);
  var dp = obj.T - (100 - obj.H)/5 + Math.random() - 0.5;
  obj2 = {"T": Number(obj.T.toFixed(1)), "H": Number(obj.H.toFixed(1)), "DP": Number(dp.toFixed(1))}
  obj3 = {Time: timeConverter(), "T": Number(obj.T.toFixed(1)), "H": Number(obj.H.toFixed(1)), "DP": Number(dp.toFixed(1))}
  mq.publish('Opiframe/softsensor', JSON.stringify(obj2));
  console.log(obj3);
	createConnection(function(){
    		addDocument(function(){
		});
	});
});

mq.on('connect', function(){
    console.log('Connected.....');
});

mq.subscribe('Opiframe/arduino');

function addDocument(onAdded){
			myCollection.insert(obj3, function(err, result) {
        if(err)
            throw err;
        console.log("entry saved");
        onAdded();
    	});
}

function createConnection(onCreate){
    MongoClient.connect('mongodb+srv://opiframe:opiframe@cluster0-fn7gd.gcp.mongodb.net/Softsensor?retryWrites=true&w=majority', function(err, client_m) {
        db = client_m.db('Softsensor');
					if(err)
            throw err;
        console.log("connected to the mongoDB !");
        myCollection = db.collection('Softsensor');
        onCreate();
	    client_m.close();
    });
}

if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}

function timeConverter(){
  var a = new Date();
  var time = a.toLocaleString()
  return time;
}
