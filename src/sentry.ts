import * as Sentry from '@sentry/electron';

export function initSentry() {
  if (!(global as any).__JEST__) {
    Sentry.init({
      dsn: 'https://966a5b01ac8d4941b81e4ebd0ab4c991@sentry.io/1882540',
    });
  }
}
