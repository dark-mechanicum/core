import EventEmitter from 'events';

abstract class Transport extends EventEmitter {
  /**
   * Initialization of Transport functionality
   * @returns {Promise<void>}
   */
  public initialize(): Promise<void> {
    return Promise.resolve();
  }

  /**
   * Terminate of Transport functionality
   * @returns {Promise<void>}
   */
  public terminate(): Promise<void> {
    return Promise.resolve();
  }
}

export {
  Transport,
};
