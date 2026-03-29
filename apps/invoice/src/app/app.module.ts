import { Module } from '@nestjs/common';
import { CONFIGURATION, IConfiguration } from '../configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static CONFIGURATION: IConfiguration = CONFIGURATION;
}
