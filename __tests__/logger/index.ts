import { AllowedLogLevels, Logger, LogMessageOptions } from '../../src/logger';

const registeredLevels: AllowedLogLevels[] = ['debug', 'info', 'notice', 'warning', 'error', 'critical', 'emergency', 'alert'];
const initialMessage: string = 'Testing message';
const initialOptions: LogMessageOptions = { tags: ['testingTag'], payload: { test: 'testPayload' } };

class TestingLogger extends Logger {
  public constructor() { super({}); }
  public async init() {}
}

describe('Logger functionality', () => {
  for (const level of registeredLevels ) {
    // testing all methods with parameters option
    it(`should emit "${level}" event with options`, (done) => {
      const testWithOptions = (logger: TestingLogger, level: string, done: jest.DoneCallback) => {
        logger.on(level, (message: string, options?: LogMessageOptions) => {
          expect(message).toEqual(initialMessage);
          expect(options).toEqual({ ...initialOptions, level });
          done();
        });
      }

      const logger = new TestingLogger();
      testWithOptions(logger, level, done)
      logger[level](initialMessage, initialOptions);
    });

    // testing all methods without options parameter
    it(`should emit "${level}" event without options`, (done) => {
      const testWithOptions = (logger: TestingLogger, level: string, done: jest.DoneCallback) => {
        logger.on(level, (message: string, options?: LogMessageOptions) => {
          expect(message).toEqual(initialMessage);
          expect(options).toEqual({ level });
          done();
        });
      }

      const logger = new TestingLogger();
      testWithOptions(logger, level, done)
      logger[level](initialMessage);
    });
  }
});
