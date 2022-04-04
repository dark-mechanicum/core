import { Transport, TransportOptions } from './transport';
import { Message } from '../message';
import EventEmitter from 'events';

/**
 * Transport options for event emitter.
 */
interface EventEmitterTransportOptions extends TransportOptions {
  /**
   * The event emitter to use.
   */
  eventEmitter?: EventEmitter;
}

/**
 * Transport that uses an event emitter to emit messages.
 */
class EventEmitterTransport extends Transport {
  protected eventEmitter: EventEmitter = new EventEmitter();

  /**
   * Creates a new event emitter transport.
   * @param {EventEmitterTransportOptions} options - The transport options.
   * @param {EventEmitter} options.eventEmitter - The event emitter to use.
   * @param {Logger} options.logger - The logger to use.
   */
  constructor(options?: EventEmitterTransportOptions) {
    super();
    this.eventEmitter = options?.eventEmitter || new EventEmitter();
  }

  /**
   * Terminate of Transport functionality
   * @returns {Promise<void>}
   */
  public async terminate(): Promise<this> {
    this.eventEmitter.removeAllListeners();

    return this;
  }

  /**
   * Send a message
   * @param {string} topic - The topic to send the message to
   * @param {Message} message - The message to send
   * @returns {Promise<void>}
   */
  public async publish(topic: string, message: Message<unknown>): Promise<void> {
    this.eventEmitter.emit(topic, message);
  }

  /**
   * Subscribe to a topic
   * @param {string} topic - The topic to subscribe to
   * @param {Function} listener - The callback to call when a message is received
   * @returns {Promise<void>}
   */
  public async subscribe(topic: string, listener: (message: Message<unknown>) => void): Promise<void> {
    this.eventEmitter.on(topic, listener);
  }

  /**
   * Unsubscribe from a topic
   * @param {string} topic - The topic to unsubscribe from
   * @param {Function} listener - The callback to remove
   * @returns {Promise<void>}
   */
  public async unsubscribe(topic: string, listener: (message: Message<unknown>) => void): Promise<void> {
    this.eventEmitter.removeListener(topic, listener);
  }
}

export {
  EventEmitterTransport,
  EventEmitterTransportOptions,
};