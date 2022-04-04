import { EventEmitterTransport } from '../../src/transport';
import { Logger } from '../../src';
import { Message } from '../../src/message';
import { Transport } from '../../src/transport';
import EventEmitter from 'events';

class TestTransport extends Transport {
  publish(topic: string, message: Message<unknown>): Promise<void> {
    this.logger.debug(`Publish message`).payload({topic, message})
    return Promise.resolve();
  }

  subscribe(topic: string, listener: (message: Message<unknown>) => Promise<void>): Promise<void> {
    this.logger.debug(`subscribe message`).payload({topic, listener})
    return Promise.resolve(undefined);
  }

  unsubscribe(topic: string, listener: (message: Message<unknown>) => Promise<void>): Promise<void> {
    this.logger.debug(`subscribe message`).payload({topic, listener})
    return Promise.resolve(undefined);
  }
}

describe('Event Emitter Transport functionality', () => {
  const logger = new Logger();

  it('should emit an event', async () => {
    const transport = new EventEmitterTransport();
    transport.setLogger(logger);
    const topic = 'test';
    const message = new Message({ payload: { test: 'test' }, topic });

    const listener = jest.fn();
    await transport.subscribe(topic, listener);
    await transport.publish(topic, message);
    await transport.unsubscribe(topic, listener);

    expect(listener).toHaveBeenCalledWith(message);
  });

  it('should initialize functionality', () => {
    const transport = new EventEmitterTransport();
    transport.setLogger(logger);
    const result = transport.initialize();
    expect(result).resolves.not.toThrow();
  });

  it('should initialize functionality with event emitter', () => {
    const transport = new EventEmitterTransport({ eventEmitter: new EventEmitter() });
    transport.setLogger(logger);
    const result = transport.initialize();
    expect(result).resolves.not.toThrow();
  });

  it('should trigger error is logger not assigned', () => {
    const transport = new EventEmitterTransport({ eventEmitter: new EventEmitter() });
    const result = transport.initialize();
    expect(result).rejects.toThrow('Logger is not assigned');
  });

  it('should terminate functionality', () => {
    const transport = new EventEmitterTransport();
    transport.setLogger(logger);
    const result = transport.terminate();
    expect(result).resolves.not.toThrow();
  });

  it('should terminate default functionality', () => {
    const transport = new TestTransport();
    transport.setLogger(logger);
    const result = transport.terminate();
    expect(result).resolves.not.toThrow();
  });
});