const MongoClient = require('mongodb').MongoClient;

var Particle = require('particle-api-js');
var particle = new Particle();

//Get the following parameters form your Particle account
var token = '50883d43c01492c2b8746bd2967bb998fa4c3b43';
var id = '430060000251353337353037';

var obj; // data object for received mqtt data
var obj_m; // data object for mongodb

var myCollection;
var db;
var client_m;


function save_data() {
	obj_m = {Time: timeConverter(Date.now()), T1: obj.T1, T2: obj.T2};
	 console.log(obj_m);
	   createConnection(function(){
    		addDocument(function(){
		  	});
	   });
}

function addDocument(onAdded){
	myCollection.insert(obj_m, function(err, result) {
	 if(err)
    throw err;
	    console.log("entry saved");
	   onAdded();
	});
}

function createConnection(onCreate){
  MongoClient.connect('mongodb+srv://opiframe:opiframe@cluster0-fn7gd.gcp.mongodb.net/DS18B?retryWrites=true&w=majority', function(err, client_m) {
	db = client_m.db('DS18B');
	   if(err)
      throw err;
	   		console.log("connected to the mongoDB !");
	   		myCollection = db.collection('DS18B');
	   	onCreate();
	   client_m.close();
  });
}

particle.getEventStream({ deviceId: id, auth: token }).then(function(stream) {
  var obj_;
    stream.on('event', function(obj_) {
			console.log("Event: ", obj_);
				if(obj_.name=="dsTmp") obj = JSON.parse(obj_.data);
				console.log(obj);
					save_data();
    		});
});

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
