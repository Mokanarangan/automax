import { expect } from 'chai';
import POS from '../src/POS';

const pos1 = new POS({
  merchantId: 'c0020-10477486',
  environment: 'tst6',
  deviceId: '1',
  dev: true,
  host: '127.0.0.1',
  port: '4444'
});

const pos2 = new POS({
  merchantId: 'c0010-10500120',
  environment: 'tst6',
  deviceId: '1',
  dev: false,
  host: '10.10.10.2',
  port: '4444'
});

before('starup the POS', function *(){
    yield pos1.start();
    // yield pos2.start();
});

describe('Order Detail', () => {
  it('should run the test', function * () {
    yield pos1.tap('Mohan R.');
		// yield pos1.exec('pay');
		// yield pos2.exec('pos3');
    // yield pos2.tap('Owner');
    yield pos1.put('Enter', '1111');
    // yield pos2.put('Enter', '1111');
    // const currentOrder = yield pos1.getState('order', 'currentOrder');
    yield pos1.coverage();
    // console.log(currentOrder);
    expect(true).to.be.equal(true);
  });
});
