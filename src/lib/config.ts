export interface AppConfig {
  port: number;
  databaseUrl: string;
  apiKey: string | undefined;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const port = Number(env.PORT ?? "3000");
  if (!Number.isFinite(port) || port <= 0) {
    throw new Error(`Invalid PORT: ${env.PORT}`);
  }

  return {
    port,
    databaseUrl: env.DATABASE_URL ?? "postgres://app:app@localhost:5432/demo",
    apiKey: env.API_KEY,
  };
}
