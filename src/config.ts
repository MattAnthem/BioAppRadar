import type { AppConfig } from "./types/config";



let config: AppConfig | null  = null

export async function loadConfig(): Promise<AppConfig> {
  const response = await fetch('/config.json');
  if (!response.ok) {
    throw new Error(`Unable to load config.json (${response.status})`);
  }
  config = await response.json();
  return config as AppConfig;
}

export function getConfig(): AppConfig {
  if (!config) {
    throw new Error('Config not loaded');
  }
  return config;
}