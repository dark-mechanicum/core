import { Message } from '../../src/message';

describe('Message Functionality', () => {
  it('should create a message', async () => {
    const message = new Message({ createdBy: 'some.actionName', payload: { foo: 'bar' } });

    expect(message).toHaveProperty('createdAt');
    expect(message.createdAt).toBeInstanceOf(Date);
    expect(message).toHaveProperty('createdBy', 'some.actionName');
    expect(message).toHaveProperty('payload', { foo: 'bar' });
  });
});