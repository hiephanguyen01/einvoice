import { AppConfiguration, BaseConfiguration, KeycloakConfiguration, TcpConfiguration } from '@common/configraruration';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
class Configuration extends BaseConfiguration {
  @ValidateNested()
  @Type(() => AppConfiguration)
  APP_CONFIG = new AppConfiguration();

  @ValidateNested()
  @Type(() => TcpConfiguration)
  TCP_SERV = new TcpConfiguration();

  @ValidateNested()
  @Type(() => KeycloakConfiguration)
  KEYCLOAK_CONFIG = new KeycloakConfiguration();
}

export const CONFIGURATION = new Configuration();

export type IConfiguration = typeof CONFIGURATION;

CONFIGURATION.validate();
