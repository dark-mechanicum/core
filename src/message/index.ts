import { randomBytes } from 'crypto';

/**
 * Options to create a new Message object
 */
interface MessageOptions<Payload> {
  /**
   * Message type (service name, action name ot other message type)
   */
  topic: string;
  /**
   * Payload of message
   */
  payload: Payload;
  /**
   * Type of payload (normal or exception)
   */
  type?: 'normal' | 'exception';
}

/**
 * Description of basic Message class
 */
class Message<Payload> {
  /**
   * Unique message identifier
   */
  readonly id: string = randomBytes(32).toString('hex');
  /**
   * Message type (service name, action name ot other message type)
   */
  readonly topic: string;
  /**
   * Date when that message was actually created
   */
  readonly createdAt: Date = new Date();
  /**
   * Payload of message
   */
  readonly payload: Payload;
  /**
   * Type of message (normal or exception)
   */
  readonly type: string = 'normal';

  constructor({ topic, payload, type }: MessageOptions<Payload>) {
    this.topic = topic;
    this.payload = payload;

    if (type) {
      this.type = type;
    }
  }
}

export {
  Message,
  MessageOptions,
};
