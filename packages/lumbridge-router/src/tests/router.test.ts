import { expect } from 'chai';
import { Router } from '..';

describe('Router', () => {
  it('should create a instance of Router', () => {
    const router = Router.create({});
    expect(router).to.be.instanceOf(Router);
  });
});
