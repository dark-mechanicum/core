import { Transport } from './transport';

class EventEmitterTransport extends Transport {
  public connect(): Promise<void> {
    return Promise.resolve();
  }

  public disconnect(): Promise<void> {
    return Promise.resolve();
  }
}

export {
  EventEmitterTransport,
};