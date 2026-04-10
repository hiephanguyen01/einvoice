import { TCP_SERVICES, TcpProvider } from '@common/configraruration';
import { ExceptionInterceptor } from '@common/interceptors';
import { LoggerMiddleware } from '@common/middlewares';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ClientsModule } from '@nestjs/microservices';
import { CONFIGURATION, IConfiguration } from './../configuration/index';
import { InvoiceModule } from './modules/invoice/invoice.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [() => CONFIGURATION] }),
    InvoiceModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ExceptionInterceptor,
    },
  ],
})
export class AppModule {
  static CONFIGURATION: IConfiguration = CONFIGURATION;

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
