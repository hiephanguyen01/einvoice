import { MongoProvider, TCP_SERVICES, TcpProvider } from '@common/configraruration';
import { UserDestination } from '@common/schemas';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { UserGrpcController } from './controllers/user-grpc.controller';
import { UserController } from './controllers/user.controller';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './service/user.service';
@Module({
  imports: [
    MongoProvider,
    MongooseModule.forFeature([UserDestination]),
    ClientsModule.registerAsync([TcpProvider(TCP_SERVICES.AUTHORIZE_SERVICE)]),
  ],
  controllers: [UserController, UserGrpcController],
  providers: [UserService, UserRepository],
  exports: [],
})
export class UserModule {}
