import { JSONSerializer } from '../../src/serializer';

describe('JSON Serializer', () => {
  const objectFixture =  { option1: 'value1' };
  const bufferFixture =  Buffer.from(JSON.stringify(objectFixture));
  const bufferASCIIFixture =  Buffer.from(JSON.stringify(objectFixture), 'ascii');

  it('should serialize object', async () => {
    const serializer = new JSONSerializer();
    const result = await serializer.serialize(objectFixture);

    expect(result).toBeInstanceOf(Buffer);
    expect(result).toStrictEqual(bufferFixture);
  });

  it('should deserialize object', async () => {
    const serializer = new JSONSerializer();
    const result = await serializer.deserialize(bufferFixture);

    expect(result).toBeInstanceOf(Object);
    expect(result).toStrictEqual(objectFixture);
  })

  it('should serialize object with specific encoding', async () => {
    const serializer = new JSONSerializer({ encoding: 'ascii' });
    const result = await serializer.serialize(objectFixture);

    expect(result).toBeInstanceOf(Buffer);
    expect(result).toStrictEqual(bufferASCIIFixture);
  });
})