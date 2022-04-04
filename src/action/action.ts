import { Message } from '../message';
import { Broker } from '../broker';
import { Logger } from '../logger';

interface ActionOptions {
  /**
   * Name of the topic listened by the action.
   */
  topic: string;
  /**
   * Timeout for action processing
   */
  timeout?: number;
}

abstract class Action<Request, Response> {
  /**
   * The topic to listen to messages
   */
  public readonly topic: string;

  /**
   * Broker functionality. Managing and sending messages.
   * @protected
   */
  private _broker?: Broker;

  /**
   * Logger functionality.
   * @protected
   */
  private _logger?: Logger;

  /**
   * Indicates is Action is initialized.
   * @protected
   */
  protected isInitialized = false;
  /**
   * Timeout for action processing
   * @protected
   */
  public readonly timeout: number = 1000;

  /**
   * Create a new action instance.
   * @param {ActionOptions} options
   * @protected
   */
  protected constructor({ topic, timeout }: ActionOptions) {
    this.topic = topic;
    this.timeout = timeout || this.timeout;
  }

  /**
   * Initialization of Action functionality
   */
  public async initialize(): Promise<this> {
    this.isInitialized = true;
    return Promise.resolve(this);
  }

  /**
   * Terminate of Action functionality
   */
  public terminate(): Promise<this> {
    return Promise.resolve(this);
  }

  /**
   * Execute the action
   * @param {Message} payload
   */
  public abstract process(payload: Request): Promise<Response>;

  /**
   * Set Logger instance
   * @param {Logger} logger
   */
  public setLogger(logger: Logger): void {
    this._logger = logger;
  }

  /**
   * Get Logger instance
   * @protected
   */
  protected get logger(): Logger {
    if(!this.isInitialized) {
      throw new Error('Action is not initialized');
    }

    if(!this._logger) {
      throw new Error('Logger is not assigned');
    }

    return this._logger;
  }

  /**
   * Set Broker instance
   * @param {Broker} broker
   */
  public setBroker(broker: Broker): void {
    this._broker = broker;
  }

  /**
   * Get Broker instance
   * @protected
   */
  protected get broker(): Broker {
    if(!this._broker) {
      throw new Error('Broker is not assigned');
    }

    return this._broker;
  }

  /**
   * Execute the action and send response to the client
   * @param {?} payload - The payload to send
   * @param id - The id of the message that should be responded to
   */
  public async execute({ payload, id }: Message<Request>): Promise<Response | Error> {
    if(!this.isInitialized) {
      throw new Error('Action is not initialized');
    }

    let message: Message<Response | Error>;
    try {
      message = new Message<Response | Error>({
        topic: id,
        payload: await this.process(payload),
      });
    } catch(error) {
      this.logger.error(`Error while processing action: ${(error as Error).message}`).exception(error);
      message = new Message<Response | Error>({
        topic: id,
        payload: error as Error,
        type: 'exception',
      });
    }

    await this.broker.send(id, message);
    return message.payload;
  }
}

export {
  Action,
  ActionOptions,
};
