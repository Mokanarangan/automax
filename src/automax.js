"use strict";
import vorpal from './vorpal';
import _ from 'lodash';
import webdriver from './webdriver';

class Automax{

  constructor(seleniumOptions, name = 'automax'){
    this.driver = webdriver(seleniumOptions);
    this.namespaces = [];
    this.vorpal = vorpal;
    this.name = name;
  }

  /**
   * Start the automax session
   */
  start(){
    var banner = `
                            __
    (\\   /)  _____   __ ___/  |_  ____   _____ _____  ___  ___
    .\\\\_//. \\__  \\ |  |  \\   __\\/  _ \\ /     \\\\__  \\ \\  \\/  /
     )0 0(   / __ \\|  |  /|  | (  <_> )  Y Y  \\/ __ \\_>    <
    ( (_) ) (____  /____/ |__|  \\____/|__|_|  (____  /__/\\_ \\
     \`'"'\`       \\/                         \\/     \\/      \\/


Welcome to ${this.name}!
You can automate all your browser related tasks with automax. To start with run help

    `;
    var vorpal = this.vorpal;
    vorpal.log(banner);
    return this.driver.current
      .then((browser) => this.initialize())
      .then(() => vorpal)
      .catch(e => {
        vorpal.log('Could not start Automax as it can not connected to Selenium server. Server Resposne ', e);
      });
  }

  initialize(){
    this.vorpal
      .delimiter(`${this.name}>>`)
      .show();

    //Exit Selenium session once over
    var window = this.driver.current;
    process.on('beforeExit', function () {
      window.end();
    });
    const browser = this.driver.current;
    return browser.initialize();
  }

  /**
   * Add a module to Automax
   * @param namespace
   * @param module
   */
  addPlugin(namespace, module){
    if (!_.isString(namespace) || _.isUndefined(module)){
      throw new Error('Arguments do not mactch the method signature');
    }

    if (_.isString(module)){
      module = require(module);
    }

    if (vorpal.find(namespace)){
      throw new Error('Namespace already registered');
    }

    console.log(`Registering plugin ${namespace}`);
    this.mockVorpal(namespace);
    this.vorpal.use(module(this));
    this.unMockVorpal();
  }

  mockVorpal(namespace){
    var vorpal = this.vorpal;
    vorpal.namespace = namespace;
    this.vopalCommand = vorpal.command;
    vorpal.command = _.wrap(vorpal.command, function (func, command, help) {
      return func.call(this, `${namespace} ${command}`, help);
    });
  }

  unMockVorpal() {
    if (_.isFunction(this.vopalCommand)){
      this.vorpal.command = this.vopalCommand;
      delete this.vorpal.namespace;
    }
  }
}


//Singleton instance of Automax
module.exports = function(options){
  return new Automax(options);
};
