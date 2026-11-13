import { clientLimits } from './client-limits';

describe('clientLimits', () => {
  it('should work', () => {
    expect(clientLimits()).toEqual('client-limits');
  })
})
