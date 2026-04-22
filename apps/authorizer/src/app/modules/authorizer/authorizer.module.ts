import { TCP_SERVICES, TcpProvider } from '@common/configraruration';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { KeycloakModule } from '../keycloak/keycloak.module';
import { AuthorizerController } from './controllers/authorizer.controller';
import { AuthorizerService } from './services/authorizer.service';

@Module({
  imports: [KeycloakModule, ClientsModule.registerAsync([TcpProvider(TCP_SERVICES.USER_ACCESS_SERVICE)])],
  controllers: [AuthorizerController],
  providers: [AuthorizerService],
})
export class AuthorizerModule {}
