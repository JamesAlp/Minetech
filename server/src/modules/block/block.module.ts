import { Module } from '@nestjs/common';
import { BlockController } from './block.controller';
import { BlockService } from './block.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockEntity } from './block.entity';
import { ModService } from '../mod/mod.service';
import { ModEntity } from '../mod/mod.entity';
import { RFGeneratorEntity } from './rf-generator.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlockEntity, ModEntity, RFGeneratorEntity])],
  controllers: [BlockController],
  providers: [BlockService, ModService],
})
export class BlockModule {}
