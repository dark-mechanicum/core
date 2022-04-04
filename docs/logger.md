## Logger
Basic logger functionality is a simple EventEmitter instance that responsible to compose a Log Message Data object and notify about it all subscribers.
Logger functionality will be based on the events emitting log events and sending that data to all Log Transports that active in the current moment.

Logger methods will return and message object that can be updated. To handle that update before emitting message data, exact emitting of message covered to the setTimeout(..., 0) call, and will be executed at the nex tick of event loop

Example
```typescript
import { Logger, LogMessageData } from '../src/logger';

const logger = new Logger();
logger.on('log-message', (data: LogMessageData) => {
  const { date, level, message, payload, tags } = data;
  console.info(`${date} ${level} [${tags?.join(',')}]: ${message}\n%j`, payload);
})

logger.info('Some info level message').tags(['example']).payload({ some: { payload: [ "Some payload here" ] } });

// errors reporting example
const error = new Error('Error message');
logger.info('Handled some exception').tags(['exception']).exception(error);
```
Output:
```text
2022-02-23T12:12:14.999Z info [example]: Some info level message
{"some":{"payload":["Some payload here"]}}
```

Logger Class Methods:
* debug(message: string) - Kernel debugging messages, output by the kernel if the developer enabled debugging at compile time
* info(message: string) - Informational messages that require no action
* notice(message: string) - Normal, but significant events
* warn(message: string) - Warning conditions that should be taken care of
* crit(message: string) - Critical conditions
* alert(message: string) - Actions that must be taken care of immediately
* emergency(message: string) - The system is unusable

All logger class messages will return an LogMessage object, that contain additional methods for chain calling:
* tags(tags: string[]) - Assign to created message additional tags
* payload(data: unknown) - Assign to created message additional data with specific user data
* exception(error: Error) - Assign to created message an exception
