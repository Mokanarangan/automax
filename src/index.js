#!/usr/bin/env node

require("babel-core/register");
var instance;
module.exports = function(options = {}){
  if(!instance){
    const automax = require('./automax')(options);
    const fs = require('fs');
    const _ = require('lodash');
    const path = require('path');
    const programe = require('commander');
    const pkgJson = require('../package.json');

    // Loop through plugins directory
    _.chain(fs.readdirSync(path.join(__dirname, 'plugins')))
    .filter(fileName => /.+\.js/.exec(fileName))
    .map(file => file.replace('.js', ''))
    .each(plugin => automax.addPlugin(_.kebabCase(plugin), path.join(__dirname, 'plugins', plugin)))
    .value();
    instance =  automax;
  }

  return instance;
}




