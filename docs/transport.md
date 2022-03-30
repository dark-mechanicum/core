## Transport

Transport functionality implements "EventEmitter" interface. Additionally, it should have 2 methods:
* connect [Promise] - connects to the transport network
* disconnect [Promise] - disconnects from the transport network

```typescript
import { EventEmitterTransport } from './eventemitter';

const transport = new EventEmitterTransport();
transport.on('some.actionName', (message: Message<{test: string}>) => {
  console.log(message);
});

transport.connect().then(() => {
  transport.emit('some.actionName', {test: 'test'});
});
```

To create your own transport, you should extend "Transport" class and replace behaviour of "connect", "disconnect" and other methods to apply EventsEmitter logic.