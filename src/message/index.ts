/**
 * Options to create a new Message object
 */
interface MessageOptions<Payload> {
  /**
   * Action name who's created that message
   */
  createdBy: string;
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
   * Action name who's created that message
   */
  readonly createdBy: string;
  /**
   * Date when that message was actually created
   */
  readonly createdAt: Date = new Date();
  /**
   * Payload of message
   */
  readonly payload: Payload;

  constructor({ createdBy, payload }: MessageOptions<Payload>) {
    this.createdBy = createdBy;
    this.payload = payload;
  }
}

export {
  Message,
  MessageOptions,
};
