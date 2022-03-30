import { randomBytes } from 'crypto';

/**
 * Options to create a new Message object
 */
interface MessageOptions<Payload> {
  /**
   * Message type (service name, action name ot other message type)
   */
  type: string;
  /**
   * Payload of message
   */
  payload: Payload;
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
  readonly type: string;
  /**
   * Date when that message was actually created
   */
  readonly createdAt: Date = new Date();
  /**
   * Payload of message
   */
  readonly payload: Payload;

  constructor({ type, payload }: MessageOptions<Payload>) {
    this.type = type;
    this.payload = payload;
  }
}

export {
  Message,
  MessageOptions,
};
