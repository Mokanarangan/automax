import _ from 'lodash';

export default function(browser){
  return function(){
  return browser
    .sessions()
    .then(({value:sessions}) => {
      console.log('Avalialble sessions: ');
      sessions.map(s => console.log(s.id));
      if (_.isEmpty(sessions)) {
        console.log('Initializing new session');
        return browser.init();
      } else {
        const currentSession = _.last(sessions).id;
        console.log(`Connecting to ${currentSession}`)
        return browser.sessionID(currentSession);
      }
    })
    .windowHandles()
    .then(() => browser)
    .catch((e) => {
        console.log(e);
        console.log('No windows open.');
        console.log('Creating new Session');
        return browser
          .session('delete')
          .init();
    });
    }
}
