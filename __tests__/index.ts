import * as Default from '../src/index';

describe('Default module exports', () => {
  it('Default export', async () => {
    expect(Default).toHaveProperty('Broker');
  });
});
