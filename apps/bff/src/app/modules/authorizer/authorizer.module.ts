import { TCP_SERVICES, TcpProvider } from '@common/configraruration';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [ClientsModule.registerAsync([TcpProvider(TCP_SERVICES.AUTHORIZE_SERVICE)])],
  controllers: [],
  providers: [],
  exports: [],
})
export class AuthorizerModule {}
