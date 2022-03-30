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

  it('should connect', () => {
    const transport = new EventEmitterTransport();
    const result = transport.connect();
    expect(result).resolves.not.toThrow();
  });

  it('should disconnect', () => {
    const transport = new EventEmitterTransport();
    const result = transport.disconnect();
    expect(result).resolves.not.toThrow();
  });
});