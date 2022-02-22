import EventEmitter from 'events';

/**
 * Allowed levels of log messages
 */
type AllowedLogLevels = 'debug' | 'info' | 'notice' | 'warning' | 'error' | 'critical' | 'emergency' | 'alert';

/**
 * Logger initialization options
 */
interface LoggerOptions {
}

/**
 * Logger methods available for users
 */
interface LoggingMethods {
  /**
   * Kernel debugging messages, output by the kernel if the developer enabled debugging at compile time
   * @param {string} message - Human explanation of record sense
   * @param {LogMessageOptions} options - List of additional options to describe a message
   * @param {string[]} options.tags - List of tags to allow filtering and process messages
   * @param {?} options.payload - Any additional information related to current log message. That value will be stringifies with JSON.stringify() method
   */
  debug(message: string, options?: LogMessageOptions): this;

  /**
   * Informational messages that require no action
   * @param {string} message - Human explanation of record sense
   * @param {LogMessageOptions} options - List of additional options to describe a message
   * @param {string[]} options.tags - List of tags to allow filtering and process messages
   * @param {?} options.payload - Any additional information related to current log message. That value will be stringifies with JSON.stringify() method
   */
  info(message: string, options?: LogMessageOptions): this;

  /**
   * Normal, but significant events.
   * @param {string} message - Human explanation of record sense
   * @param {LogMessageOptions} options - List of additional options to describe a message
   * @param {string[]} options.tags - List of tags to allow filtering and process messages
   * @param {?} options.payload - Any additional information related to current log message. That value will be stringifies with JSON.stringify() method
   */
  notice(message: string, options?: LogMessageOptions): this;

  /**
   * Warning conditions that should be taken care of.
   * @param {string} message - Human explanation of record sense
   * @param {LogMessageOptions} options - List of additional options to describe a message
   * @param {string[]} options.tags - List of tags to allow filtering and process messages
   * @param {?} options.payload - Any additional information related to current log message. That value will be stringifies with JSON.stringify() method
   */
  warning(message: string, options?: LogMessageOptions): this;

  /**
   * Non-critical error conditions.
   * @param {string} message - Human explanation of record sense
   * @param {LogMessageOptions} options - List of additional options to describe a message
   * @param {string[]} options.tags - List of tags to allow filtering and process messages
   * @param {?} options.payload - Any additional information related to current log message. That value will be stringifies with JSON.stringify() method
   */
  error(message: string, options?: LogMessageOptions): this;

  /**
   * Critical conditions.
   * @param {string} message - Human explanation of record sense
   * @param {LogMessageOptions} options - List of additional options to describe a message
   * @param {string[]} options.tags - List of tags to allow filtering and process messages
   * @param {?} options.payload - Any additional information related to current log message. That value will be stringifies with JSON.stringify() method
   */
  critical(message: string, options?: LogMessageOptions): this;

  /**
   * Actions that must be taken care of immediately.
   * @param {string} message - Human explanation of record sense
   * @param {LogMessageOptions} options - List of additional options to describe a message
   * @param {string[]} options.tags - List of tags to allow filtering and process messages
   * @param {?} options.payload - Any additional information related to current log message. That value will be stringifies with JSON.stringify() method
   */
  alert(message: string, options?: LogMessageOptions): this;

  /**
   * The system is unusable.
   * @param {string} message - Human explanation of record sense
   * @param {LogMessageOptions} options - List of additional options to describe a message
   * @param {string[]} options.tags - List of tags to allow filtering and process messages
   * @param {?} options.payload - Any additional information related to current log message. That value will be stringifies with JSON.stringify() method
   */
  emergency(message: string, options?: LogMessageOptions): this;
}

/**
 * Description of additional options that can be passed to the log message
 */
interface LogMessageOptions {
  /**
   * List of tags to allow filtering and process messages
   * @type {string[]}
   */
  tags?:string[],

  /**
   * Any additional information related to current log message. That value will be stringifies with JSON.stringify() method
   * @type {?}
   */
  payload?: unknown,
}

/**
 * Internal description of log message
 */
interface LogMessageStructure extends LogMessageOptions {
  /**
   * Log level of message
   */
  level: AllowedLogLevels;
}

/**
 * Logger functionality that emits messages and allowing to subscribe transports to the log events for processing.
 */
abstract class Logger extends EventEmitter implements LoggingMethods {
  protected constructor(options: LoggerOptions) {
    super();
  }

  /**
   * Make an initialization of Logger object.
   */
  public abstract init(): Promise<void>;

  /**
   * Actions that must be taken care of immediately.
   * @param {string} message - Human explanation of record sense
   * @param {LogMessageOptions} options - List of additional options to describe a message
   * @param {string[]} options.tags - List of tags to allow filtering and process messages
   * @param {?} options.payload - Any additional information related to current log message. That value will be stringifies with JSON.stringify() method
   */
  public alert(message: string, options?: LogMessageOptions): this {
    this.emit('alert', message, { ...options, level: 'alert' } as LogMessageStructure);
    return this;
  }

  /**
   * Critical conditions.
   * @param {string} message - Human explanation of record sense
   * @param {LogMessageOptions} options - List of additional options to describe a message
   * @param {string[]} options.tags - List of tags to allow filtering and process messages
   * @param {?} options.payload - Any additional information related to current log message. That value will be stringifies with JSON.stringify() method
   */
  public critical(message: string, options?: LogMessageOptions): this {
    this.emit('critical', message, { ...options, level: 'critical' } as LogMessageStructure);
    return this;
  }

  /**
   * Kernel debugging messages, output by the kernel if the developer enabled debugging at compile time
   * @param {string} message - Human explanation of record sense
   * @param {LogMessageOptions} options - List of additional options to describe a message
   * @param {string[]} options.tags - List of tags to allow filtering and process messages
   * @param {?} options.payload - Any additional information related to current log message. That value will be stringifies with JSON.stringify() method
   */
  public debug(message: string, options?: LogMessageOptions): this {
    this.emit('debug', message, { ...options, level: 'debug' } as LogMessageStructure);
    return this;
  }

  /**
   * The system is unusable.
   * @param {string} message - Human explanation of record sense
   * @param {LogMessageOptions} options - List of additional options to describe a message
   * @param {string[]} options.tags - List of tags to allow filtering and process messages
   * @param {?} options.payload - Any additional information related to current log message. That value will be stringifies with JSON.stringify() method
   */
  public emergency(message: string, options?: LogMessageOptions): this {
    this.emit('emergency', message, { ...options, level: 'emergency' } as LogMessageStructure);
    return this;
  }

  /**
   * Non-critical error conditions.
   * @param {string} message - Human explanation of record sense
   * @param {LogMessageOptions} options - List of additional options to describe a message
   * @param {string[]} options.tags - List of tags to allow filtering and process messages
   * @param {?} options.payload - Any additional information related to current log message. That value will be stringifies with JSON.stringify() method
   */
  public error(message: string, options?: LogMessageOptions): this {
    this.emit('error', message, { ...options, level: 'error' } as LogMessageStructure);
    return this;
  }

  /**
   * Informational messages that require no action
   * @param {string} message - Human explanation of record sense
   * @param {LogMessageOptions} options - List of additional options to describe a message
   * @param {string[]} options.tags - List of tags to allow filtering and process messages
   * @param {?} options.payload - Any additional information related to current log message. That value will be stringifies with JSON.stringify() method
   */
  public info(message: string, options?: LogMessageOptions): this {
    this.emit('info', message, { ...options, level: 'info' } as LogMessageStructure);
    return this;
  }

  /**
   * Normal, but significant events.
   * @param {string} message - Human explanation of record sense
   * @param {LogMessageOptions} options - List of additional options to describe a message
   * @param {string[]} options.tags - List of tags to allow filtering and process messages
   * @param {?} options.payload - Any additional information related to current log message. That value will be stringifies with JSON.stringify() method
   */
  public notice(message: string, options?: LogMessageOptions): this {
    this.emit('notice', message, { ...options, level: 'notice' } as LogMessageStructure);
    return this;
  }

  /**
   * Warning conditions that should be taken care of.
   * @param {string} message - Human explanation of record sense
   * @param {LogMessageOptions} options - List of additional options to describe a message
   * @param {string[]} options.tags - List of tags to allow filtering and process messages
   * @param {?} options.payload - Any additional information related to current log message. That value will be stringifies with JSON.stringify() method
   */
  public warning(message: string, options?: LogMessageOptions): this {
    this.emit('warning', message, { ...options, level: 'warning' } as LogMessageStructure);
    return this;
  }
}

export {
  Logger,

  LoggerOptions,
  LoggingMethods,
  LogMessageOptions,
  LogMessageStructure,

  AllowedLogLevels,
};