type LogContext = Record<string, unknown> | undefined;

export const logInfo = (event: string, ctx?: LogContext) => {
  const payload = {
    level: "info" as const,
    event,
    timestamp: new Date().toISOString(),
    ...(ctx ?? {}),
  };

  console.log(JSON.stringify(payload));
};

export const logError = (event: string, error: unknown, ctx?: LogContext) => {
  const normalizedError =
    error instanceof Error
      ? { message: error.message, stack: error.stack }
      : { message: String(error) };

  const payload = {
    level: "error" as const,
    event,
    timestamp: new Date().toISOString(),
    ...normalizedError,
    ...(ctx ?? {}),
  };

  console.error(JSON.stringify(payload));
};
