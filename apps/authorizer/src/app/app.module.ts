import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CONFIGURATION, IConfiguration } from '../configuration';
import { AuthorizerModule } from './modules/authorizer/authorizer.module';
import { KeycloakModule } from './modules/keycloak/keycloak.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [() => CONFIGURATION] }), KeycloakModule, AuthorizerModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  static CONFIGURATION: IConfiguration = CONFIGURATION;
}
