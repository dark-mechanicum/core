import EventEmitter from 'events';

/**
 * Allowed levels of log messages
 */
type LogLevelTypes = 'debug' | 'info' | 'notice' | 'warn' | 'error' | 'crit' | 'emerg' | 'alert';

/**
 * Log message data structure that will be delivered to the log transports
 */
interface LogMessageData {
  /**
   * Date when log message was created
   */
  date: Date;
  /**
   * Level of log message
   */
  level: LogLevelTypes;
  /**
   * Human explanation of record sense
   */
  message: string;
  /**
   * Tags that allows to filter data at the next steps
   */
  tags?: string[];
  /**
   * Usefully data that describes a log message in details
   */
  payload?: unknown;
}

/**
 * Description of the log message
 */
class LogMessage {
  /**
   * Date when log message was created
   * @protected
   */
  protected _date: Date;
  /**
   * Level of log message
   * @protected
   */
  protected _level: LogLevelTypes;
  /**
   * Human explanation of record sense
   * @protected
   */
  protected _message: string;
  /**
   * Usefully data that describes a log message in details
   * @protected
   */
  protected _payload?: unknown;
  /**
   * Tags that allows to filter data at the next steps
   * @protected
   */
  protected _tags: Set<string> = new Set();

  /**
   * Creates a new one log message
   * @param {LogLevelTypes} level - One of the allowed levels for log message
   * @param {string} message
   */
  constructor(level: LogLevelTypes, message: string) {
    this._date = new Date();
    this._message = message;
    this._level = level;
  }

  /**
   * Assign usefully data that describes a log message in details
   * @param {?} data - Usefully data that describes a log message in details. Will be used JSON.stringify() to convert it into the JSON structure for next steps
   */
  payload(data: unknown) {
    this._payload = data;
    return this;
  }

  /**
   * Assign tags that allow to filter data at the next steps
   * @param {string[]} tags
   */
  tags(tags: string[]): this {
    tags.forEach((tag: string) => this._tags.add(tag));
    return this;
  }

  /**
   * Method converts log message object to JSON structure
   */
  toJSON(): LogMessageData {
    const data: LogMessageData = {
      date: this._date,
      level: this._level,
      message: this._message,
    };

    if (this._payload) {
      data.payload = this._payload;
    }

    if (this._tags.size > 0) {
      data.tags = Array.from<string>(this._tags);
    }

    return data;
  }
}

/**
 * Logger functionality that emits messages and allowing to subscribe transports to the log events for processing.
 */
class Logger extends EventEmitter {
  /**
   * Initialization of Logger functionality
   * @returns {Promise<void>}
   */
  public initialize(): Promise<void> {
    return Promise.resolve();
  }

  /**
   * Terminate of Logger functionality
   * @returns {Promise<void>}
   */
  public terminate(): Promise<void> {
    return Promise.resolve();
  }

  /**
   * Actions that must be taken care of immediately.
   * @param {string} message - Human explanation of record sense
   */
  public alert(message: string): LogMessage {
    const struct = new LogMessage('alert', message);
    this.emitLogMessage(struct);
    return struct;
  }

  /**
   * Critical conditions.
   * @param {string} message - Human explanation of record sense
   */
  public crit(message: string): LogMessage {
    const struct = new LogMessage('crit', message);
    this.emitLogMessage(struct);
    return struct;
  }

  /**
   * Kernel debugging messages, output by the kernel if the developer enabled debugging at compile time
   * @param {string} message - Human explanation of record sense
   */
  public debug(message: string): LogMessage {
    const struct = new LogMessage('debug', message);
    this.emitLogMessage(struct);
    return struct;
  }

  /**
   * The system is unusable.
   * @param {string} message - Human explanation of record sense
   */
  public emerg(message: string): LogMessage {
    const struct = new LogMessage('emerg', message);
    this.emitLogMessage(struct);
    return struct;
  }

  /**
   * Non-critical error conditions.
   * @param {string} message - Human explanation of record sense
   */
  public error(message: string): LogMessage {
    const struct = new LogMessage('error', message);
    this.emitLogMessage(struct);
    return struct;
  }

  /**
   * Informational messages that require no action
   * @param {string} message - Human explanation of record sense
   */
  public info(message: string) {
    const struct = new LogMessage('info', message);
    this.emitLogMessage(struct);
    return struct;
  }

  /**
   * Normal, but significant events.
   * @param {string} message - Human explanation of record sense
   */
  public notice(message: string): LogMessage {
    const struct = new LogMessage('notice', message);
    this.emitLogMessage(struct);
    return struct;
  }

  /**
   * Warning conditions that should be taken care of.
   * @param {string} message - Human explanation of record sense
   */
  public warn(message: string): LogMessage {
    const struct = new LogMessage('warn', message);
    this.emitLogMessage(struct);
    return struct;
  }

  /**
   * Emits log message for all listeners
   * @param message
   * @protected
   */
  protected emitLogMessage(message: LogMessage) {
    setTimeout(() => {
      this.emit('log-message', message.toJSON());
    }, 0);
  }
}

export {
  Logger,
  LogLevelTypes,
  LogMessageData,
};