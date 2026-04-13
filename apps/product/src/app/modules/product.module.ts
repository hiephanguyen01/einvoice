import { TypeOrmProvider } from '@common/configraruration';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmProvider],
  controllers: [],
  providers: [],
  exports: [],
})
export class ProductModule {}
