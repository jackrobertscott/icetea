import { expect } from 'chai';
import { Router } from '..';

describe('const route = Router.create()', () => {
  it('should create a instance of Router', () => {
    const router = Router.create({ routes: [] });
    expect(router).to.be.instanceOf(Router);
  });
  describe('const Routes = router.routes()', () => {
    it.skip('should create a react element');
  });
});
