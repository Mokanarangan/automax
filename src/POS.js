"use strict";
import _ from 'lodash';
import co from 'co';

export default class POS{

    constructor({ merchantId, environment, deviceId, dev = false, host, port = '4444' }){
      this.merchantId = merchantId;
      this.environment = environment;
      this.deviceId = deviceId;
      this.dev = dev;
      this.host = host;
      this.port = port;
    }

    start() {
      const _this = this;
      return function*(){ 
          if(!_this.automax) {
            _this.automax = yield require('./index')().start();
            _(_this.automax.commands)
            .filter(command => _.includes(command._name,'cinco'))
            .map(filtered => _this.addFunction(filtered._name))
            .value();
          }
          yield _this.automax.exec(`cinco changePOS ${_this.host}`);
          yield _this.automax.exec(`cinco start ${_this.merchantId} ${_this.environment} ${_this.deviceId} ${_this.dev}`);
      };
    }

    addFunction(command){
      const _this = this;
      const cincoCommand = _.replace(command, 'cinco ', '');
      this[cincoCommand] = co.wrap(function*(){
        let command = `cinco ${cincoCommand}`;
        const args = arguments;
        _.range(args.length)
        .map(index => command = `${command} '${args[`${index}`]}'`)
        console.log(command);
        yield _this.automax.exec(`cinco changePOS ${_this.host}`);
        return yield _this.automax.exec(command);
      })
    }
    
    exec(file){
      const _this = this;
      return function*(){
        yield _this.automax.exec(`execute cinco ./saved/${file}.txt`);
      }
    }
    
}



