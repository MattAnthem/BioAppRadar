import type { AppConfig } from "./types/config";



let config: AppConfig  = {
  API_BASE_URL: "http://localhost:8585"
};

export async function loadConfig(): Promise<AppConfig> {
  const response = await fetch('/config.json');
  if (!response.ok) {
    throw new Error(`Impossible de charger config.json (${response.status})`);
  }
  config = await response.json();
  return config;
}

export function getConfig(): AppConfig {
  if (!config) {
    throw new Error('Config non chargée');
  }
  return config;
}