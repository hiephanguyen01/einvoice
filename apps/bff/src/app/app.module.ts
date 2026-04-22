import { TCP_SERVICES, TcpProvider } from '@common/configraruration';
import { PermissionGuard, UserGuard } from '@common/guards';
import { ExceptionInterceptor } from '@common/interceptors';
import { LoggerMiddleware } from '@common/middlewares';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ClientsModule } from '@nestjs/microservices';
import { CONFIGURATION, IConfiguration } from './../configuration/index';
import { AuthorizerModule } from './modules/authorizer/authorizer.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { ProductModule } from './modules/product/product.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [() => CONFIGURATION] }),
    InvoiceModule,
    ProductModule,
    UserModule,
    AuthorizerModule,
    ClientsModule.registerAsync([TcpProvider(TCP_SERVICES.AUTHORIZE_SERVICE)]),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ExceptionInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: UserGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {
  static CONFIGURATION: IConfiguration = CONFIGURATION;

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
