var Promise = require('bluebird');
var _ = require('lodash');
import tap from './commands/tap';
import put from './commands/put';
import highlight from './commands/highlight';
import sessionID from './commands/sessionID';
import selector from './commands/selector';
import initialize from './commands/initialize';
import changePOS from './commands/changePOS';

var defaultOptions = {
  desiredCapabilities: {
    browserName: 'chrome',
  },
};

export default function(options){
  const opts = Object.assign({}, defaultOptions, options)
  var browser = require('webdriverio')
    .remote(opts);
  
  browser
    .addCommand('selector', selector(browser));
  browser
    .addCommand('sessionID', sessionID(browser));
  browser
    .addCommand('tap', tap(browser));
  browser
    .addCommand('put', put(browser));
  browser
    .addCommand('highlight', highlight(browser));
  browser
    .addCommand('initialize', initialize(browser));
  browser
    .addCommand('changePOS', changePOS(browser));

  return {
    current: browser,
    switchTo: (tabIndex) => browser.getTabIds().then((tabIds) => browser.switchTab(tabIds[tabIndex])),
    new: browser.newWindow,
  };
}

