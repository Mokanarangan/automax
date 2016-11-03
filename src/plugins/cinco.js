var _ = require('lodash');
module.exports = function({ vorpal, driver: { current, state }}){
  vorpal
    .command('start <mid> <env> <deviceId> [dev]', 'Check for state')
    .action(({ mid , env, deviceId, dev = false }) => current
      // .url('http://localhost:8888'));
      .url(
      dev ? `http://localhost:8888?mid=${mid}&env=${env}&deviceId=${deviceId}` :
      `http://localhost:8080/pos?index.html?mid=${mid}&env=${env}&deviceId=${deviceId}`)
      .waitForExist('#ctaf_home_user_list',100000)
      );


  vorpal
    .command('actions', 'Get the console actions')
    .action(() => current
      .log('browser')
      .then(logs => {
        return _(logs.value)
          .filter(log => log.level === 'INFO'
            && log.message.includes('action') 
            && !log.message.includes('router'))
          .map(log => log.message
            .split('@')[1]
            .replace(/ /g,''))
          .value();
        }));

  
  vorpal
    .command('getState <state>', 'get state value')
    .action(({ state }) => current
    .execute(`return store(['${state}'])`)
    .then(({ value }) => value));


  vorpal
    .command('tap <value> [id]', 'click on element based on text')
    .action(({ value, id = 0 }) => current
    .tap(value, id)
    .then((res) => {
      if(!res){
        throw Error('Element not found');
      } else {
        return Promise.resolve(true);
      }
    }));


  vorpal
    .command('put <param> <value>', 'click on element based on text')
    .action(({ param, value }) => current
    .put(param, value)
    .then((res) => {
      if(!res){
        throw Error('Element not found');
      } else {
        return Promise.resolve(true);
      }
    }));

  vorpal
    .command('highlight <param>', 'Highlight mutliple parameters')
    .action(({ param}) => current
      .highlight(param)
      .then((res) => {
        console.log(res.value);
      }));


  vorpal
    .command('tapId <param>', 'Tap based on highlighted id')
    .action(({ param }) => current
    .execute(`
      var main = document.getElementById('app');
      _.range(1,main.childNodes.length).map(val => {
      var element = main.childNodes[1];
      element.parentNode.removeChild(element);
      })`)
    .elementIdClick(param)
          .catch(()=>true)

      );

  vorpal
    .command('changePOS <host> [port]', 'switch between POS')
    .action(({ host, port }) => current
    .changePOS(host,port));


}
