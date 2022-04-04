import { Logger } from '../logger';

type SerializerOption = Record<string, unknown>;

/**
 * Abstract class for implementing new serialization functionality
 */
abstract class Serializer {
  /**
   * The logger to use for logging
   */
  private _logger?: Logger;

  /**
   * Initialization of Serializer functionality
   * @returns {Promise<void>}
   */
  public initialize(): Promise<this> {
    return Promise.resolve(this);
  }

  /**
   * Terminate of Serializer functionality
   * @returns {Promise<void>}
   */
  public terminate(): Promise<this> {
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
   * Convert data from serialized view to internal data structure
   * @param {Buffer} data - Binary data representation
   */
  public abstract deserialize<T>(data: Buffer): Promise<T>;

  /**
   * Convert data to the serialized view
   * @param {?} payload
   */
  public abstract serialize(payload: unknown): Promise<Buffer>;
}

export {
  Serializer,
  SerializerOption,
};
