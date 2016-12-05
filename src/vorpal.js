const fs = require('fs');
var vorpal = require('vorpal')();
var coVorpal = require('co-vorpal')
var _ = require('lodash');
var Promise = require('bluebird');

coVorpal(vorpal);

vorpal
  .command('execute <namespace> <task>', 'Execute prewritten script')
  .action(function *({ namespace, task }){
    const commands = fs.readFileSync(`./saved/${task}.txt`).toString().trim().split('\n');
    for(let i = 0; i < commands.length; i++){
      console.log(commands[i]);
      yield vorpal.execSync(`${namespace} ${commands[i]}`);
    }});

vorpal
  .history('automax');

module.exports = vorpal;


