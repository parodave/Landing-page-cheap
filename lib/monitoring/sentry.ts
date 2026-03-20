import * as Sentry from '@sentry/nextjs';

type MonitoringContext = {
  route?: string;
  feature?: string;
  payload?: Record<string, unknown>;
};

export function captureApiException(error: unknown, context: MonitoringContext = {}) {
  Sentry.withScope((scope) => {
    if (context.route) {
      scope.setTag('route', context.route);
    }

    if (context.feature) {
      scope.setTag('feature', context.feature);
    }

    if (context.payload) {
      scope.setContext('payload', context.payload);
    }

    Sentry.captureException(error);
  });
}
