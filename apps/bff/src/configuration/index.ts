import { AppConfiguration } from '@common/configraruration/app.config';
import { BaseConfiguration } from '@common/configraruration/base.config';
class Configuration extends BaseConfiguration {
  APP_CONFIG = new AppConfiguration();
}

export const CONFIGURATION = new Configuration();

export type IConfiguration = typeof CONFIGURATION;
