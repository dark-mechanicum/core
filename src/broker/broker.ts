import { Transport } from '../transport';
import { Action } from '../action';
import { Logger } from '../logger';
import { Message } from '../message';

/**
 * Options to initialize broker functionality.
 */
interface BrokerOptions {
  /**
   * List of actions to be registered in broker.
   */
  actions: Array<Action<unknown, unknown>>;
  /**
   * Transport to use for communication.
   */
  transport: Transport;
  /**
   * Timeout to wait response from action.
   */
  timeout?: number;
  /**
   * Logger to use.
   */
  logger: Logger;
}

/**
 * Main functionality to manage messages between actions and transports.
 */
class Broker {
  /**
   * List of action to process messages
   * @protected
   */
  protected actions: Map<string, Action<unknown, unknown>> = new Map();
  /**
   * Transport functionality to manage messages.
   * @protected
   */
  protected transport: Transport;
  /**
   * Logger functionality to handle messages
   * @protected
   */
  protected logger: Logger;
  /**
   * Initialize broker functionality.
   * @protected
   */
  protected isInitialized = false;

  /**
   * Constructor of broker
   * @param {BrokerOptions} options - Options to initialize broker functionality.
   * @param {Transport} options.transport - Transport to use for communication.
   */
  public constructor({ transport, logger, actions }: BrokerOptions) {
    this.transport = transport;
    this.logger = logger;
    actions.forEach((action) => this.actions.set(action.topic, action));
  }

  /**
   * Initialization of Broker functionality
   * @returns {Promise<void>}
   */
  public async initialize(): Promise<this> {
    this.transport.setLogger(this.logger);

    await this.transport.initialize();
    await Promise.all(Array.from(this.actions.values()).map(action => this.registerAction(action)));
    await Promise.all(Array.from(this.actions.values()).map(action => action.initialize()));

    this.isInitialized = true;
    this.logger.info('Broker initialized');

    return this;
  }

  /**
   * Terminate of Broker functionality
   * @returns {Promise<void>}
   */
  public async terminate(): Promise<this> {
    this.isInitialized = false;

    await this.transport.terminate();
    await Promise.all(Array.from(this.actions.values()).map(action => action.terminate()));

    this.logger.info('Broker terminated');

    return this;
  }

  /**
   * Register an action
   * @param {Action} action - Action instance to register
   * @returns {Promise<void>}
   */
  protected async registerAction(action: Action<unknown, unknown>): Promise<void> {
    action.setBroker(this);
    action.setLogger(this.logger);

    await this.transport.subscribe(action.topic, async (message: Message<unknown>): Promise<void> => {
      try {
        this.logger.debug(`Received message ${message.id} for action ${action.topic}`).payload(message);
        const result = await action.execute(message);
        this.logger.debug(`Processed message ${message.id} for action ${action.topic}`).payload(result);
      } catch (error) {
        this.logger.error(`Can't process message ${message.id} for action ${action.topic}`).payload(message).exception(error);
      }
    });

    this.logger.debug(`Action ${action.topic} registered`);
  }

  /**
   * Send a message to an action
   * @param {string} topic - Topic of the message
   * @param {Message} message - Message to send
   * @returns {Promise<void>}
   */
  public async send(topic: string, message: Message<unknown>): Promise<void> {
    if(!this.isInitialized) {
      throw new Error('Broker is not initialized');
    }

    this.logger.debug(`Sending message ${message.id}`).payload(message);
    await this.transport.publish(topic, message);
    this.logger.debug(`Message ${message.id} sent`).payload(message);
  }

  /**
   * Call an action
   * @param {Action} topic - Action name to call
   * @param {?} payload - Payload to send to action
   * @returns {Promise<?>}
   */
  public async call<InputPayload, OutputPayload>(topic: string, payload?: InputPayload): Promise<OutputPayload> {
    if(!this.isInitialized) {
      throw new Error('Broker is not initialized');
    }

    const message = new Message({ topic, payload });

    return new Promise((resolve, reject) => {
      // this timer will reject promise on timeout
      const timeout = setTimeout(async () => {
        this.logger.error(`Timeout for message ${message.id} for action ${topic}`).payload(message);
        await this.transport.unsubscribe(message.id, listener);
        reject(new Error(`Timeout for message ${message.id}`));
      }, (this.actions.get(topic) as Action<unknown,unknown>).timeout);

      // this listener will resolve promise on response
      const listener = async (result: Message<unknown | Error>) => {
        this.logger.debug(`Message ${message.id} processed`).payload(result);
        clearTimeout(timeout);
        await this.transport.unsubscribe(message.id, listener);

        if (result.type === 'exception') {
          reject(result.payload);
        } else {
          resolve(result.payload as OutputPayload);
        }
      };

      this.transport.subscribe(message.id, listener);
      this.logger.debug(`Sending message ${message.id} for action ${topic}`).payload(message);
      this.transport.publish(message.topic, message);
    });
  }
}

export {
  Broker,
};
