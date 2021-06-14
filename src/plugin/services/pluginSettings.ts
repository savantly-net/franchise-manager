import { AppPluginMeta } from '@savantly/sprout-api';
import { AppPluginSettings } from 'plugin/types';

export interface AppPluginSettingsService {
  getSettings: AppPluginMeta<AppPluginSettings>;
}

let singletonInstance: AppPluginSettingsService;

/**
 * @internal
 */
export function setAppPluginSettingsService(instance: AppPluginSettingsService) {
  singletonInstance = instance;
}

/**
 * @public
 */
export function getAppPluginSettingsService(): AppPluginSettingsService {
  return singletonInstance;
}
