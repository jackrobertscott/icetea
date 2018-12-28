import { expect } from 'code';
import Router from '../modules/Router';

describe('const router = Router.create()', () => {
  it('should create an instance without error', () => {
    const router = Router.create();
    expect(router).to.be.instanceOf(Router);
  });
});
