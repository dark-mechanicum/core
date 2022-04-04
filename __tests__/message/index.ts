import { Message } from '../../src/message';

describe('Message Functionality', () => {
  it('should create a message', async () => {
    const message = new Message({ topic: 'some.actionName', payload: { foo: 'bar' } });

    expect(message).toHaveProperty('id');
    expect(message.id).toHaveLength(64);
    expect(message).toHaveProperty('createdAt');
    expect(message.createdAt).toBeInstanceOf(Date);
    expect(message).toHaveProperty('topic', 'some.actionName');
    expect(message).toHaveProperty('payload', { foo: 'bar' });
  });
});