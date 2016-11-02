var co = require("co");

const automax = require('./lib/index.js');

const getState = (path) => automax.exec(`cinco getState ${path}`);
const getActions = () => automax.exec('cinco actions');

co(function*(){

  yield automax.exec('cinco start');
  yield automax.exec("cinco tap 'Mohan R.'");
  yield automax.exec("cinco put  'Enter Password' 1111");
  yield automax.exec("cinco tap 'Sign In'");
  yield automax.exec('cinco tap "Order Queue"');
  yield automax.exec("cinco tap 91");
  

  const auth = yield getState('auth');
  console.log(auth);
  const actions = yield getActions();
  console.log(actions);
});

