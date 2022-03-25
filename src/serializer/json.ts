import { Serializer } from './serializer';

interface JSONSerializerOptions {
  /**
   * Encoding of binary data
   */
  encoding?: BufferEncoding;
}

/**
 * JSON serializer for Node.js data
 */
class JSONSerializer extends Serializer {
  protected encoding: BufferEncoding = 'utf8';

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