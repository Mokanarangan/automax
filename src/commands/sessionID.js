export default function(browser){
  return function(sessionID) {
    if (sessionID) {
      this.requestHandler.sessionID = sessionID;
    } else {
      this.requestHandler.sessionID;
    }
    return browser;
  }
};
