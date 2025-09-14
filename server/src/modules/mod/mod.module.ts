import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModEntity } from './mod.entity';
import { ModController } from './mod.controller';
import { ModService } from './mod.service';

@Module({
  imports: [TypeOrmModule.forFeature([ModEntity])],
  controllers: [ModController],
  providers: [ModService],
})
export class ModModule {}
