var Promise = require('bluebird');
var _ = require('lodash');
import tap from './commands/tap';
import put from './commands/put';
import highlight from './commands/highlight';
import sessionID from './commands/sessionID';
import selector from './commands/selector';

var defaultOptions = {
  desiredCapabilities: {
    browserName: 'chrome',
  },
  // host: '10.10.10.107',
  // port: '4444'
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

  return {
    current: browser,
    switchTo: (tabIndex) => browser.getTabIds().then((tabIds) => browser.switchTab(tabIds[tabIndex])),
    new: browser.newWindow,
  };
}

