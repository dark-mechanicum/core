/**
 * Abstract class for implementing new serialization functionality
 */
abstract class Serializer {
  /**
   * Initialization of Serializer functionality
   * @returns {Promise<void>}
   */
  public initialize(): Promise<void> {
    return Promise.resolve();
  }

  /**
   * Terminate of Serializer functionality
   * @returns {Promise<void>}
   */
  public terminate(): Promise<void> {
    return Promise.resolve();
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
};
