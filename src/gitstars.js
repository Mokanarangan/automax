var random = require('node-random-name');
var randomPlace = require('random-name');
var co = require("co");
const _ = require('lodash');
const name = random({first: true, gender: 'male'}) + _.random(1000);
const email = `${name}@gmail.com`;
const password = random({last: true, gender: 'male'}) +  random({last: true, gender: 'male'}) + _.random(100);
const pic = _.random(100);
const place = randomPlace.place();
console.log(name + ', ' + password, place)

console.log = () => {};
const automax = require('../lib/index.js');
co(function*(){
  yield automax.exec(`github signup ${email} ${name} ${password}`);
  const userId = yield automax.execSync('github userId');
  yield automax.exec(`github updateProfile ${userId} /tmp/profiles/${pic}.jpg ${place}`)
  yield automax.exec('github star udnisap debuk ');
})
