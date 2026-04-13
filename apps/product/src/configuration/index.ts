import { AppConfiguration, BaseConfiguration, TcpConfiguration } from '@common/configraruration';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { TypeOrmConfiguration } from '@common/configraruration';
class Configuration extends BaseConfiguration {
  @ValidateNested()
  @Type(() => AppConfiguration)
  APP_CONFIG = new AppConfiguration();

  @ValidateNested()
  @Type(() => TcpConfiguration)
  TCP_SERV = new TcpConfiguration();

  @ValidateNested()
  @Type(() => TypeOrmConfiguration)
  TYPEORM_CONFIG = new TypeOrmConfiguration();
}

export const CONFIGURATION = new Configuration();

export type IConfiguration = typeof CONFIGURATION;

CONFIGURATION.validate();
