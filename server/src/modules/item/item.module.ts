import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModEntity } from './item.entity';
import { ModController } from './item.controller';
import { ModService } from './item.service';

@Module({
  imports: [TypeOrmModule.forFeature([ModEntity])],
  controllers: [ModController],
  providers: [ModService],
})
export class ModModule {}
