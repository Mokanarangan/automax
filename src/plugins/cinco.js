var _ = require('lodash');
var fs = require('fs');

module.exports = function({ vorpal, driver: { current, state }}){
  vorpal
    .command('start <mid> <env> <deviceId> [dev]', 'Check for state')
    .action(({ mid , env, deviceId, dev = 'true' }) => current
      // .url('http://localhost:8888'));
      .url(
      dev === 'true' ? `http://localhost:8888?mid=${mid}&env=${env}&deviceId=${deviceId}` :
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
    .command('getState [params...]', 'get state value')
    .action(({ params }) => current
    .execute(`return store([${_.reduce(params, (command, val) => `${command}'${val}',`,'')}])`)
    .then(({ value }) => value));


  vorpal
    .command('coverage', 'get state value')
    .action(() => current
    .execute('return window.__coverage__')
    .then(({ value }) => {
      return fs.writeFile('coverage.json', JSON.stringify(value));

    }));

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
		.getCookie('highlightCount')
		.then(res => current.elementIdClick(`${parseInt(param)+parseInt(res.value)}`))

      );

  vorpal
    .command('changePOS <host> [port]', 'switch between POS')
    .action(({ host, port }) => current
    .changePOS(host,port));

  vorpal
    .command('initEventListener')
    .action(() => current
    .execute(`
      window.eventList = [];
      window.eventCount = 0;
      document.removeEventListener('click', window.clickEventListener);
      document.removeEventListener('keydown', window.keyEventListener);
      window.xpath = function xpath(el) {
        if (typeof el == "string") return document.evaluate(el, document, null, 0, null)
        if (!el || el.nodeType != 1) return ''
        if (el.id) return "//*[@id='" + el.id + "']"
        var sames = [].filter.call(el.parentNode.children, function (x) { return x.tagName == el.tagName })
        return xpath(el.parentNode) + '/' + el.tagName.toLowerCase() + (sames.length > 1 ? '['+([].indexOf.call(sames, el)+1)+']' : '')
      }
      window.keyEventListener = function(event){
        window.eventList.push({id:window.eventCount, type:'key', key:event.keyCode, element:window.xpath(event.target) })
        window.eventCount = window.eventCount+1;
      }
      window.clickEventListener = function(event){
        window.eventList.push({id:window.eventCount, type:'click', element:window.xpath(event.target) })
        window.eventCount = window.eventCount+1;
      };

      document.addEventListener("click", window.clickEventListener)
      document.addEventListener("keydown", window.keyEventListener)
      `));

  vorpal
    .command('saveEvents <name>')
    .action(({name}) => current
      .execute(`return window.eventList`)
      .then(res => { 
        const commands = _(res.value)
          .sortBy(['eventCount'])
          .map(event => event.type === 'click' ? `clickXpath "${event.element}"`
            : `setXpath "${event.element}" ${event.key}`)
          .value();
        console.log(commands); 
        return fs.writeFile(`./saved/${name}.txt`, commands.join('\n'));
      })
    )
  vorpal
    .command('clickXpath [params...]')
    .action(({params}) => {
			let xPath = params.join('');
			return current
      .waitForExist(xPath,10000)
			.scroll(xPath)
      .click(xPath)
			.catch(e =>{
          xPath = xPath.replace( /\*\[([^\]])*\]\//, '' );
					return current.waitForExist(xPath,10000)
						.click(xPath);
			})
			.catch((e) => {
				if(e.message !== 'element not visible'){
					throw e;
				}
			})
		})
			
   
   vorpal
    .command('setXpath [params...]')
    .action(({params}) =>{
			const val = String.fromCharCode(params[params.length-1]);
			params.splice(-1,1);
			let xPath = params.join('');
			 return current
      	.waitForExist(xPath,100000)
      	.addValue(xPath, val)
				.catch(e =>{
							xPath = xPath.replace( /\*\[([^\]])*\]\//, '' );
												return current.waitForExist(xPath,10000)
																		.click(xPath);
				})
		});

}
