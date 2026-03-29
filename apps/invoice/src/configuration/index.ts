import { AppConfiguration, BaseConfiguration, TcpConfiguration } from '@common/configraruration';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
class Configuration extends BaseConfiguration {
  @ValidateNested()
  @Type(() => AppConfiguration)
  APP_CONFIG = new AppConfiguration();
  TCP_SERV = new TcpConfiguration();
}

export const CONFIGURATION = new Configuration();

export type IConfiguration = typeof CONFIGURATION;

CONFIGURATION.validate();
