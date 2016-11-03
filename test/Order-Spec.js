import { expect } from 'chai';

const pos1 = '127.0.0.1';
const pos2 = '10.10.10.2';
describe('Order Detail', () => {
  it('should run the test', function * () {
    const automax = yield require('../src/index.js')().start();
    yield automax.exec('cinco start c0020-10477486 tst6 1 true');
    yield automax.exec('cinco changePOS 10.10.10.2');
    yield automax.exec('cinco start c0010-10500120 tst6 1');
    const order = yield automax.exec('cinco getState order');
    console.log(order);

    expect(true).to.be.equal(true);
  });
});
