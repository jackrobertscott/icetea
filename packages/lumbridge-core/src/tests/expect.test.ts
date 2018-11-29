import { expect } from 'chai';
import * as utils from '..';

describe('Utils', () => {
  describe('expect.type()', () => {
    it('should throw an error when value does not match type', () => {
      const data = {
        check: true,
      };
      expect(() =>
        utils.expect.type('data.check', data.check, 'string')
      ).to.throw();
    });
    it('should throw an error when value is not provided and not optional.', () => {
      const data = {} as any;
      expect(() =>
        utils.expect.type('data.check', data.check, 'string')
      ).to.throw();
    });
    it('should not throw an error when value is not provided and optional.', () => {
      const data = {} as any;
      expect(() =>
        utils.expect.type('data.check', data.check, 'string', true)
      ).to.not.throw();
    });
  });
});
