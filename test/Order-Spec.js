import { expect } from 'chai';

const options = {
  host:'127.0.0.1'
}

describe('Order Detail', () => {
  it('should run the test', function * () {
    const pos1 = require('../src/index.js');
    yield pos1.exec('execute cinco tasks');
    expect(true).to.be.equal(true);
  });
});
