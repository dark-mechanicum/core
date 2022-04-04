import { JSONSerializer } from '../../src/serializer';
import { Logger } from '../../src';
import { Serializer } from '../../src/serializer';

describe('JSON Serializer', () => {
  const logger = new Logger();
  const objectFixture =  { option1: 'value1' };
  const bufferFixture =  Buffer.from(JSON.stringify(objectFixture));
  const bufferASCIIFixture =  Buffer.from(JSON.stringify(objectFixture), 'ascii');

  it('should initialize functionality', () => {
    const serializer = new JSONSerializer();
    serializer.setLogger(logger);

    const result = serializer.initialize();

    expect(result).resolves.not.toThrow()
  });

  it('should terminate functionality', () => {
    const serializer = new JSONSerializer();
    serializer.setLogger(logger);

    const result = serializer.terminate();

    expect(result).resolves.not.toThrow()
  });

  it('should trigger exception if logger not assigned', () => {
    class TestSerializer extends Serializer {
      public constructor() {super();}

      async serialize(payload: unknown): Promise<Buffer> {
        this.logger.debug('Serializing payload');
        return Promise.resolve(Buffer.from(JSON.stringify(payload)));
      }

      async deserialize<T>(data: Buffer): Promise<T> {
        return Promise.resolve(data as unknown as T);
      }
    }

    const serializer = new TestSerializer();
    expect(serializer.serialize({})).rejects.toThrow('Logger is not assigned');

    serializer.setLogger(logger);
    expect(serializer.serialize({})).resolves.toBeInstanceOf(Buffer);
  });

  it('should serialize object', async () => {
    const serializer = new JSONSerializer();
    serializer.setLogger(logger);

    const result = await serializer.serialize(objectFixture);

    expect(result).toBeInstanceOf(Buffer);
    expect(result).toStrictEqual(bufferFixture);
  });

  it('should deserialize object', async () => {
    const serializer = new JSONSerializer();
    serializer.setLogger(logger);

    const result = await serializer.deserialize(bufferFixture);

    expect(result).toBeInstanceOf(Object);
    expect(result).toStrictEqual(objectFixture);
  })

  it('should serialize object with specific encoding', async () => {
    const serializer = new JSONSerializer({ encoding: 'ascii' });
    serializer.setLogger(logger);

    const result = await serializer.serialize(objectFixture);

    expect(result).toBeInstanceOf(Buffer);
    expect(result).toStrictEqual(bufferASCIIFixture);
  });
})