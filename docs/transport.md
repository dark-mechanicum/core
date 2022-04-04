## Transport
Transports are used to send and receive messages. They are used to sending and receive messages from the network. Any transport should use serialization and deserialization to send and receive messages. Typical format of messages is binary data that can be handled by `Buffer` class.

```typescript
import { Transport, TransportOptions } from './transport';
import { Message } from '../message';
import EventEmitter from 'events';

class EventEmitterTransport extends Transport {
  protected eventEmitter: EventEmitter = new EventEmitter();
  public async terminate() { this.eventEmitter.removeAllListeners(); }
  public async publish(topic: string, message: Message<unknown>): Promise<void> { this.eventEmitter.emit(topic, message);}
  public async subscribe(topic: string, listener: (message: Message<unknown>) => void): Promise<void> { this.eventEmitter.on(topic, listener); }
  public async unsubscribe(topic: string, listener: (message: Message<unknown>) => void): Promise<void> { this.eventEmitter.removeListener(topic, listener); }
}

const transport = new EventEmitterTransport();
transport.subscribe('topic', (message) => console.log(message.payload));
transport.publish('topic', { message: { payload: 'Hello World' } });

// output: "Hello World"
```

Transport have 3 required methods:
* subscribe(topic: string, listener: (message: Message<unknown> => void): Promise<void> - Subscribing to topic and handle message from subscribed topic
* publish(topic: string, message: Message<unknown>): Promise<void> - Publish message to topic
* unsubscribe(topic: string, listener: (message: Message<unknown> => void): Promise<void> - Unsubscribe from topic