import { expect } from 'code';
import * as utils from '..';

describe('expect.type()', () => {
  it('should throw an error when value does not match type', () => {
    const data = { check: true };
    const validate = () =>
      utils.expect.type('data.check', data.check, 'string');
    expect(validate).to.throw();
  });
  it('should throw an error when value is required but not provided', () => {
    const data = {} as any;
    const validate = () =>
      utils.expect.type('data.check', data.check, 'string');
    expect(validate).to.throw();
  });
  it('should not throw an error when value is not required and not provided', () => {
    const data = {} as any;
    const validate = () =>
      utils.expect.type('data.check', data.check, 'string', true);
    expect(validate).to.not.throw();
  });
});
