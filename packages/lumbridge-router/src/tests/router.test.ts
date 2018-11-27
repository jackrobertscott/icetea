import { expect } from 'chai';
import { Router } from '..';

describe('Router', () => {
  describe('routerInstance', () => {
    it('should create a instance of Router', () => {
      const router = Router.create({
        routes: {},
      });
      expect(router).to.be.instanceOf(Router);
    });
    it('should have a "Routes" property', () => {
      const router = Router.create({
        routes: {},
      });
      expect(typeof router.Routes).to.equal('function');
    });
  });
});
