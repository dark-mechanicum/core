import { Message } from '../message';
import { Logger } from '../logger';

/**
 * Transport options interface description
 */
type TransportOptions = Record<string, unknown>;

abstract class Transport {
  /**
   * Logger that used in transport
   * @protected
   */
  private _logger?: Logger;

  /**
   * Initialization of Transport functionality
   * @returns {Promise<void>}
   */
  public async initialize(): Promise<this> {
    this.logger.debug(`Transport "${this.constructor.name}" initialized`);
    return Promise.resolve(this);
  }

  /**
   * Terminate of Transport functionality
   * @returns {Promise<void>}
   */
  public terminate(): Promise<this> {
    this.logger.debug(`Transport "${this.constructor.name}" terminated`);
    return Promise.resolve(this);
  }

  /**
   * Get Logger instance
   * @protected
   */
  protected get logger(): Logger {
    if (!this._logger) {
      throw new Error('Logger is not assigned');
    }

    return this._logger;
  }

  /**
   * Set Logger instance
   * @param {Logger} logger
   */
  public setLogger(logger: Logger): void {
    this._logger = logger;
  }

  /**
   * Publish message to the transport
   * @param {string} topic - Topic of message
   * @param {Message} message - Message that will be published
   * @returns {Promise<void>}
   */
  public abstract publish(topic: string, message: Message<unknown>): Promise<void>;

  /**
   * Subscribe to the transport
   * @param {string} topic - Name of action that will be subscribed
   * @param {Function} listener - Function that will be called when required message type will be received
   * @returns {Promise<void>}
   */
  public abstract subscribe(topic: string, listener: (message: Message<unknown>) => Promise<void>): Promise<void>;

  /**
   * Unsubscribe listener from the transport
   * @param {string} topic - Name of action that will be unsubscribed
   * @param {Function} listener - Listener that will be unsubscribed
   */
  public abstract unsubscribe(topic: string, listener: (message: Message<unknown>) => Promise<void>): Promise<void>;
}

export {
  Transport,
  TransportOptions,
};
