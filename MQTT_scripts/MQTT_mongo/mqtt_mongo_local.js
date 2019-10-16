
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


mq.on('message', function(topic, message) {
  console.log(message.toString('utf8'));
  obj = JSON.parse(message);
  console.log(obj.Time, obj.T, obj.H);
	createConnection(function(){
    		addDocument(function(){
		});
	});
});

mq.on('connect', function(){
    console.log('Connected.....');
});

mq.subscribe('Opiframe/data');

function addDocument(onAdded){
			myCollection.insert(obj, function(err, result) {
        if(err)
            throw err;
        console.log("entry saved");
        onAdded();
    	});
}

function createConnection(onCreate){
    MongoClient.connect('mongodb://127.0.0.1:27017/Opiframe_2', function(err, client_m) {
        db = client_m.db('Opiframe_2');
					if(err)
            throw err;
        console.log("connected to the mongoDB !");
        myCollection = db.collection('Opiframe_2');
        onCreate();
	    client_m.close();
    });
}
