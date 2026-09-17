export type LogLevel = "debug" | "info" | "warn" | "error";

export interface Logger {
  debug: (message: string, meta?: Record<string, unknown>) => void;
  info: (message: string, meta?: Record<string, unknown>) => void;
  warn: (message: string, meta?: Record<string, unknown>) => void;
  error: (message: string, meta?: Record<string, unknown>) => void;
}

function write(level: LogLevel, scope: string, message: string, meta?: Record<string, unknown>): void {
  const line = {
    ts: new Date().toISOString(),
    level,
    scope,
    message,
    ...(meta ? { meta } : {}),
  };
  const sink = level === "error" ? console.error : console.log;
  sink(JSON.stringify(line));
}

export function createLogger(scope: string): Logger {
  return {
    debug: (message, meta) => write("debug", scope, message, meta),
    info: (message, meta) => write("info", scope, message, meta),
    warn: (message, meta) => write("warn", scope, message, meta),
    error: (message, meta) => write("error", scope, message, meta),
  };
}
