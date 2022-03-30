import EventEmitter from 'events';

abstract class Transport extends EventEmitter {
  public abstract connect(): Promise<void>;
  public abstract disconnect(): Promise<void>;
}

export {
  Transport,
};
