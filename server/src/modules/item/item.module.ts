import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemEntity } from './item.entity';
import { ModController } from './item.controller';
import { ModService } from './item.service';

@Module({
  imports: [TypeOrmModule.forFeature([ItemEntity])],
  controllers: [ModController],
  providers: [ModService],
})
export class ModModule {}
