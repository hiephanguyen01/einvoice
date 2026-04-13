import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CONFIGURATION, IConfiguration } from '../configuration';
import { RoleModule } from './modules/role/role.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [() => CONFIGURATION] }), RoleModule],
})
export class AppModule {
  static CONFIGURATION: IConfiguration = CONFIGURATION;
}
