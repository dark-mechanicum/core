import { LogLevelTypes, Logger, LogMessageData } from '../../src/logger';

const initialMessage = 'Testing message';
const initialOptions = { tags: ['testingTag'], payload: { test: 'testPayload' } };
const initialError = new Error('Testing error');
const registeredLevels: LogLevelTypes[] = [
  'debug',
  'info',
  'notice',
  'warn',
  'error',
  'crit',
  'emerg',
  'alert',
];

describe('Logger functionality', () => {
  it('should initialize functionality', () => {
    const serializer = new Logger();
    const result = serializer.initialize();
    expect(result).resolves.not.toThrow()
  });

  it('should terminate functionality', () => {
    const serializer = new Logger();
    const result = serializer.terminate();
    expect(result).resolves.not.toThrow()
  });

  for (const level of registeredLevels) {
    // testing all methods with parameters option
    it(`should emit "${level}" event with options`, (done) => {
      const verify = (logger: Logger, level: string, done: jest.DoneCallback) => {
        logger.on('log-message', (message: LogMessageData) => {
          expect(message).toHaveProperty('message', initialMessage);
          expect(message).toHaveProperty('level', level);
          expect(message).toHaveProperty('date');
          expect(message).toHaveProperty('payload', initialOptions.payload);
          expect(message).toHaveProperty('tags', [level, ...initialOptions.tags]);
          expect(message).toHaveProperty('error', { ...initialError });
          done();
        });
      };

      const logger = new Logger();
      verify(logger, level, done);
      logger[level](initialMessage).tags(initialOptions.tags).payload(initialOptions.payload).exception(initialError);
    });

    // testing all methods without options parameter
    it(`should emit "${level}" event without options`, (done) => {
      const verify = (logger: Logger, level: string, done: jest.DoneCallback) => {
        logger.on('log-message', (message: LogMessageData) => {
          expect(message).toHaveProperty('message', initialMessage);
          expect(message).toHaveProperty('level', level);
          expect(message).toHaveProperty('date');
          expect(message).not.toHaveProperty('payload');
          expect(message).toHaveProperty('tags', [level]);
          done();
        });
      };

      const logger = new Logger();
      verify(logger, level, done);
      logger[level](initialMessage);
    });

    // testing all methods only with tags
    it(`should emit "${level}" event only with tags`, (done) => {
      const verify = (logger: Logger, level: string, done: jest.DoneCallback) => {
        logger.on('log-message', (message: LogMessageData) => {
          expect(message).toHaveProperty('message', initialMessage);
          expect(message).toHaveProperty('level', level);
          expect(message).toHaveProperty('date');
          expect(message).not.toHaveProperty('payload');
          expect(message).toHaveProperty('tags', [level, ...initialOptions.tags]);
          done();
        });
      };

      const logger = new Logger();
      verify(logger, level, done);
      logger[level](initialMessage).tags(initialOptions.tags);
    });

    // testing all methods only with payload
    it(`should emit "${level}" event only with payload`, (done) => {
      const verify = (logger: Logger, level: string, done: jest.DoneCallback) => {
        logger.on('log-message', (message: LogMessageData) => {
          expect(message).toHaveProperty('message', initialMessage);
          expect(message).toHaveProperty('level', level);
          expect(message).toHaveProperty('date');
          expect(message).toHaveProperty('payload', initialOptions.payload);
          expect(message).toHaveProperty('tags', [level]);
          done();
        });
      };

      const logger = new Logger();
      verify(logger, level, done);
      logger[level](initialMessage).payload(initialOptions.payload);
    });
  }

  it('should keep sequence of log events in the right way', (done) => {
    const logger = new Logger();

    let counter = 0;
    logger.on('log-message', (data: LogMessageData) => {
      const { message } = data;
      expect(message).toStrictEqual(`Message #${counter}`)
      counter++ && counter == 100 && done();
    });

    for (let i = 0; i < 100; i++) {
      logger.info(`Message #${i}`);
    }
  });
});
