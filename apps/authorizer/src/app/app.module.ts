import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CONFIGURATION, IConfiguration } from '../configuration';
import { KeycloakModule } from './modules/keycloadk/keycloak.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [() => CONFIGURATION] }), KeycloakModule],
})
export class AppModule {
  static CONFIGURATION: IConfiguration = CONFIGURATION;
}
