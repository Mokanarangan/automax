export default function(browser){
  return function(host, port='4444'){
    this.requestHandler.defaultOptions.port= port;
    this.requestHandler.defaultOptions.hostname=host;
    this.requestHandler.sessionID=null;
    return browser.initialize();
  }
};
  
