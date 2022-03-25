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
* createdBy [string] - name of the action who's created that message
* payload [unknown0] - some usefully payload for the message

Available data:
* createdAt [Date] - actual date of message creating
* createdBy [string] - name of the action who's created that message
* payload [unknown0] - some usefully payload for the message