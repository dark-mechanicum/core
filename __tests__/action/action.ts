import { Action, ActionOptions } from '../../src/action';
import { Message } from '../../src/message';
import { Logger } from '../../src';

type InputPayload = { request: string };
type OutputPayload = { response: string };

class TestAction extends Action<InputPayload, OutputPayload> {
  public constructor(options: ActionOptions) {
    super(options);
  }

  public async process({ request }: InputPayload): Promise<OutputPayload> {
    this.logger.info('TestAction.process');
    await this.broker.send('test.echo', new Message<unknown>({ topic: 'test.echo', payload: request }));
    return { response: request };
  }
}

describe('Action functionality', () => {
  it('should trigger error if action not init', () => {
    const action = new TestAction({ topic: 'test' });
    expect(action.process({ request: 'request' })).rejects.toThrow('Action is not initialized');
  });

  it('should trigger error if logger not assigned', async () => {
    const action = new TestAction({ topic: 'test' });
    await action.initialize();
    await expect(action.process({ request: 'request' })).rejects.toThrow('Logger is not assigned');
  });

  it('should trigger error if action is not initialized', async () => {
    const action = new TestAction({ topic: 'test' });
    await expect(action.execute(new Message<InputPayload>({ topic: 'test.echo', payload: { request: 'test' } }))).
      rejects.
      toThrow('Action is not initialized');
  });

  it('should trigger error if broker not assigned', async () => {
    const action = new TestAction({ topic: 'test' });
    await action.initialize();
    action.setLogger(new Logger());
    await expect(action.process({ request: 'request' })).rejects.toThrow('Broker is not assigned');
  });
});