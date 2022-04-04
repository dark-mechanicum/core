import { Broker } from '../../src/broker';
import { EventEmitterTransport } from '../../src/transport';
import { Action, ActionOptions } from '../../src/action';
import { Logger } from '../../src';
import { Message } from '../../src/message';

type InputPayload = { request: string };
type OutputPayload = { response: string };

class TestAction extends Action<InputPayload, OutputPayload> {
  public constructor(options: ActionOptions) {
    super(options);
  }

  public async process({ request }: InputPayload): Promise<OutputPayload> {
    this.logger.info('TestAction.process');
    return { response: request };
  }
}

describe('Broker functionality', () => {
  let broker: Broker;
  let action: Action<unknown, unknown>;

  beforeEach(async () => {
    action = new TestAction({ topic: 'testTopic', timeout: 10 });
    broker = new Broker({
      logger: new Logger(),
      transport: new EventEmitterTransport(),
      actions: [action],
    });

    const init = broker.initialize();
    await expect(init).resolves.not.toThrow();
  });

  afterEach(async () => {
    const terminate = broker.terminate();
    await expect(terminate).resolves.not.toThrow();
  });

  it('should be able to handle exception in user logic action processor', async () => {
    jest.spyOn(action, 'process').mockImplementationOnce(() => {
      throw new Error('test error');
    });

    const response = broker.call('testTopic', { request: 'test' });
    await expect(response).rejects.toThrow('test error');
  });

  it('should be able to handle exception in user logic executor', async () => {
    jest.useFakeTimers();
    jest.spyOn(action, 'execute').mockImplementationOnce(() => {
      throw new Error('test error');
    });

    const response = broker.call('testTopic', { request: 'test' });
    jest.advanceTimersByTime(10);
    await expect(response).rejects.toThrow('Timeout for message');

    jest.useRealTimers();
  });

  it('should be able to call action and receive response', async () => {
    const response = broker.call('testTopic', { request: 'test' });
    await expect(response).resolves.toEqual({ response: 'test' });
  });

  it('should trigger error if sending message on non initialized broker', () => {
    const broker = new Broker({
      logger: new Logger(),
      transport: new EventEmitterTransport(),
      actions: [action],
    });

    const send = broker.send('testTopic', new Message<unknown>({ topic: 'testTopic', payload: { request: 'test' } }));
    expect(send).rejects.toThrow('Broker is not initialized');
  });

  it('should trigger error if calling action on non initialized broker', () => {
    const broker = new Broker({
      logger: new Logger(),
      transport: new EventEmitterTransport(),
      actions: [action],
    });

    const send = broker.call('testTopic', new Message<unknown>({ topic: 'testTopic', payload: { request: 'test' } }));
    expect(send).rejects.toThrow('Broker is not initialized');
  });
});