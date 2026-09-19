/**
 * Simple logger utility to replace console.error in production code.
 * In development, logs to console. In production, could be extended
 * to send to an error tracking service.
 */

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  timestamp: string;
}

const isDevelopment = import.meta.env.DEV;

function formatMessage(level: LogLevel, message: string, context?: Record<string, unknown>): string {
  const entry: LogEntry = {
    level,
    message,
    context,
    timestamp: new Date().toISOString()
  };
  return JSON.stringify(entry);
}

export const logger = {
  error: (message: string, context?: Record<string, unknown>) => {
    if (isDevelopment) {
      console.error(formatMessage('error', message, context));
    } else {
      // In production, could send to error tracking service
      // e.g., Sentry, LogRocket, etc.
    }
  },

  warn: (message: string, context?: Record<string, unknown>) => {
    if (isDevelopment) {
      console.warn(formatMessage('warn', message, context));
    }
  },

  info: (message: string, context?: Record<string, unknown>) => {
    if (isDevelopment) {
      console.info(formatMessage('info', message, context));
    }
  },

  debug: (message: string, context?: Record<string, unknown>) => {
    if (isDevelopment) {
      console.debug(formatMessage('debug', message, context));
    }
  }
};

/**
 * Helper to create a child logger with additional context
 */
export function createChildLogger(baseContext: Record<string, unknown>) {
  return {
    error: (message: string, context?: Record<string, unknown>) => 
      logger.error(message, { ...baseContext, ...context }),
    warn: (message: string, context?: Record<string, unknown>) => 
      logger.warn(message, { ...baseContext, ...context }),
    info: (message: string, context?: Record<string, unknown>) => 
      logger.info(message, { ...baseContext, ...context }),
    debug: (message: string, context?: Record<string, unknown>) => 
      logger.debug(message, { ...baseContext, ...context })
  };
}