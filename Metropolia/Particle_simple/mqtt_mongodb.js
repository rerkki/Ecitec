const MongoClient = require('mongodb').MongoClient;

var Particle = require('particle-api-js');
var particle = new Particle();

//Get the following parameters form your Particle account
var token = '7a824f21406e9a4932d6fa4de0a8d1e4aa91469b';
var id = '28003c001647363335343834';

var obj; // data object for received mqtt data
var m_obj; // data object for mongodb 

var myCollection;
var db;
var client_m;


function save_data() {
	 obj_ = JSON.parse(obj);
	 m_obj = {Time: timeConverter(Date.now()), ID: obj.ID, T: obj.T, RH: obj.RH};
	 console.log(m_obj);
	   createConnection(function(){
    		  addDocument(function(){
		  });
	   });
}

function addDocument(onAdded){
   myCollection.insert(p_obj, function(err, result) {
	if(err)
           throw err;
	   console.log("entry saved");
	   onAdded();
	});
}

function createConnection(onCreate){
    MongoClient.connect('mongodb+srv://metropolia:metropolia@cluster0-fn7gd.gcp.mongodb.net/dht_sensor?retryWrites=true&w=majority', function(err, client_m) {
	db = client_m.db('dht_sensor');
	   if(err)
              throw err;
	   console.log("connected to the mongoDB !");
	   myCollection = db.collection('dht_sensor');
	   onCreate();
	   client_m.close();
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

particle.getEventStream({ deviceId: id, auth: token }).then(function(stream) {
  var obj_p;
    stream.on('event', function(obj_p) {
	console.log("Event: ", obj_p);
	obj = obj_p.data;
	save_data();
    });
});