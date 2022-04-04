import { Serializer, SerializerOption } from './serializer';

/**
 * JSON Serializer Options
 */
interface JSONSerializerOptions extends SerializerOption {
  /**
   * Encoding of binary data
   */
  encoding?: BufferEncoding;
}

/**
 * JSON serializer for Node.js data
 */
class JSONSerializer extends Serializer {
  /**
   * Encoding of binary data
   * @protected
   */
  protected encoding: BufferEncoding = 'utf8';

  /**
   * Create a new one instance of JSONSerializer
   * @param {JSONSerializerOptions} options - Serializer options
   * @param {BufferEncoding} options.encoding - Encoding of binary data
   * @param {Logger} options.logger - Logger instance
   */
  constructor(options?: JSONSerializerOptions) {
    super();
    this.encoding = options?.encoding || 'utf8';
  }

  /**
   * Convert data from binary view to the exact data
   * @param {Buffer} data
   */
  async deserialize<T>(data: Buffer): Promise<T> {
    return JSON.parse(data.toString(this.encoding));
  }

  /**
   * Convert exact data to the binary view
   * @param {?} payload
   */
  async serialize(payload: unknown): Promise<Buffer> {
    return Buffer.from(JSON.stringify(payload));
  }
}

export {
  JSONSerializer,
  JSONSerializerOptions,
};