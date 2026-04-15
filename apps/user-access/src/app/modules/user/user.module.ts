import { MongoProvider } from '@common/configraruration';
import { UserDestination } from '@common/schemas';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './controllers/user.controller';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './service/user.service';
@Module({
  imports: [MongoProvider, MongooseModule.forFeature([UserDestination])],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [],
})
export class UserModule {}
