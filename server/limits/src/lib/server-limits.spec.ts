import { serverLimits } from './server-limits';

describe('serverLimits', () => {
  it('should work', () => {
    expect(serverLimits()).toEqual('server-limits');
  })
})
