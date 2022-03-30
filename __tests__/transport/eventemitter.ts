import { EventEmitterTransport } from '../../src/transport/eventemitter';

describe('Event Emitter Transport functionality', () => {
  it('should emit an event', () => {
    const transport = new EventEmitterTransport();
    const event = 'test';
    const data = {
      test: 'test',
    };
    const listener = jest.fn();
    transport.on(event, listener);
    transport.emit(event, data);
    expect(listener).toHaveBeenCalledWith(data);
  });

  it('should initialize functionality', () => {
    const transport = new EventEmitterTransport();
    const result = transport.initialize();
    expect(result).resolves.not.toThrow();
  });

  it('should terminate functionality', () => {
    const transport = new EventEmitterTransport();
    const result = transport.terminate();
    expect(result).resolves.not.toThrow();
  });
});