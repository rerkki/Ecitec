const MongoClient = require('mongodb').MongoClient;

var Particle = require('particle-api-js');
var particle = new Particle();

//Get the following parameters form your Particle account
var token = '5beafd73840a4abb4030ff51536e476d60ac9edb';
var id = 'e00fce687a30ce4a7258e746';

var obj; // data object for received mqtt data
var obj_m; // data object for mongodb

var myCollection;
var db;
var client_m;


function save_data() {
	obj_m = {Time: timeConverter(Date.now()), diff: obj.diff};
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
  MongoClient.connect('mongodb+srv://opiframe:opiframe@cluster0-fn7gd.gcp.mongodb.net/automaatio?retryWrites=true&w=majority', function(err, client_m) {
	db = client_m.db('automaatio');
	   if(err)
      throw err;
	   		console.log("connected to the mongoDB !");
	   		myCollection = db.collection('kaivo2');
	   	onCreate();
	   client_m.close();
  });
}

particle.getEventStream({ deviceId: id, auth: token }).then(function(stream) {
  var obj_;
    stream.on('event', function(obj_) {
			console.log("Event: ", obj_);
				if(obj_.name=="kaivo") obj = JSON.parse(obj_.data);
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
