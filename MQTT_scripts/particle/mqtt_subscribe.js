
const mqtt    = require('mqtt');  //vaatii asennuksen; npm i mqtt
const mq  = mqtt.connect('mqtt://broker.mqttdashboard.com:1883',{});
var i = 0;

//tämä funktio ilmoittaa onnistuneesta liittymisestä brokerille
//tämä myös ajastaa mittaukset ja datanlähetyksen
mq.on('connect', function(){
    console.log('Connected');
    setInterval(function(){pub_index()},5000); //tällä rivillä ajastetaan pub_index -funktio (alla)
});

//Tämä funktio lähettää mittaus- ja datanlähetyspyynnön Particle-laittelille
function pub_index(){
  mq.publish('opiframe3/request/ID5', i.toString());  //vaihda oikea ID#
  i +=1;
  console.log(i);
};

//tämä funktio tilaa datan mqtt-brokerilta
mq.subscribe('opiframe3/data/ID5'); //vaihda oikea ID#

//tämä funktio näyttää mqtt-viestit, kun niitä saapuu
mq.on('message', function(topic, message) {
  console.log(message.toString('utf8'));
  obj = JSON.parse(message);
  console.log(obj); //tämä JSON-objekti on se, joka voidaan näyttää UI:ssa
});
