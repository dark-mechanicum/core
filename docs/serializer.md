## Serializer
Basic functionality for serializing and deserializing data. Used to prepare data for transferring it by network messaging protocols. All data should be converted to `Buffer` object after serialization.

You can create your own Serializer functionality by implementing abstract `Serializer` class:
```typescript
import { Serializer } from '../src/serializer/serializer';

class JSON extends Serializer {
  constructor() {
    super();
  }

  async deserialize<T>(data: Buffer): Promise<T> {
    return JSON.parse(data.toString());
  }

  async serialize(payload: unknown): Promise<Buffer> {
    return Buffer.from(JSON.stringify(payload));
  }
}
```

## JSON Serializer

Basic implementation of serialization mechanism with JSON format. Converting data to the JSON string and using `encoding` parameter to translate it into `Buffer object

Supporting next list of constructor options:
* encoding [optional] - Encoding of data that storing in the `Buffer`. Encoding parameter should be the same for serialization and deserialization serializer instances. Using 'utf8' by default

```typescript
import { JSONSerializer } from '../src/serializer/json';
const jsonSerializer = new JSONSerializer({ encoding: 'ascii' });
const serialized = jsonSerializer.serialize({ foo: 'bar' });
console.log(jsonSerializer.deserialize<object>(serialized)); // Output: { foo: 'bar' }
```