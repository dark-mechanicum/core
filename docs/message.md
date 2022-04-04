## Message
Message is a simple structure to describe a message structure. That structure will be used to transfer communication data between a Broker and Action processors.

```typescript
import { Message } from './index';

new Message({
  createdBy: 'some.actionName',
  payload: {
    foo: 'bar'
  }
})
```

Options:
* topic [string] - what topic will be used to publish this message
* payload [unknown] - some usefully payload for the message

Available data:
* id [string] - unique randomly generated hex string with 64 characters length
* createdAt [Date] - actual date of message creating
* type [string] - message type (service name, action name ot other message type)
* payload [unknown0] - some usefully payload for the message