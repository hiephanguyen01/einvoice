import { MongoProvider } from '@common/configraruration';
import { RoleDestination } from '@common/schemas';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleRepository } from './repositories/role.repository';
import { RoleService } from './service/role.service';
@Module({
  imports: [MongoProvider, MongooseModule.forFeature([RoleDestination])],
  controllers: [],
  providers: [RoleRepository, RoleService],
  exports: [RoleRepository],
})
export class RoleModule {}
