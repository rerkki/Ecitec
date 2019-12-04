
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

mq.subscribe('Opiframe6/#');

function addDocument(onAdded){
			myCollection.insert(obj, function(err, result) {
        if(err)
            throw err;
        console.log("entry saved");
        onAdded();
    	});
}

function createConnection(onCreate){
    MongoClient.connect('mongodb://opiframe:opiframe@cluster0-shard-00-00-fn7gd.gcp.mongodb.net:27017,cluster0-shard-00-01-fn7gd.gcp.mongodb.net:27017,cluster0-shard-00-02-fn7gd.gcp.mongodb.net:27017/dhtData?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority', function(err, client_m) {
        db = client_m.db('dhtData');
					if(err)
            throw err;
        console.log("connected to the mongoDB !");
        myCollection = db.collection('dhtData');
        onCreate();
	    client_m.close();
    });
}
