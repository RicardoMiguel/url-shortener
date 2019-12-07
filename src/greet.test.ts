import { expect } from 'chai';
import { greeter } from './greet';

describe('Greet', function() {
  it('should greet person', function () {
    const result = greeter({ firstName: 'Adam', lastName: 'Lo' });

    expect(result).to.equal('Hello, Adam Lo');
  })
})
