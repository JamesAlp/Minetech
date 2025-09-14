import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { BlockEntity, BlockType } from './block.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import CreateBlockDTO from './dto/create-block.dto';
import { ModService } from '../mod/mod.service';
import { RFGeneratorEntity } from './rf-generator.entity';
import UpdateBlockDTO from './dto/update-block.dto';

@Injectable()
export class BlockService {
  constructor(
      private readonly dataSource: DataSource,
      @InjectRepository(BlockEntity) private blockRepository: Repository<BlockEntity>,
      @InjectRepository(RFGeneratorEntity) private readonly genRepo: Repository<RFGeneratorEntity>,
      private readonly modService: ModService
    ) {}

  async create(dto: CreateBlockDTO) {
    const mod = await this.modService.findOne(dto.modName);
    if (!mod) throw new NotFoundException('Mod not found');
    
    if (dto.type === BlockType.RF_GENERATOR && dto.rfPerTick == null) {
      throw new BadRequestException('rfPerTick is required for RF Generators.');
    }

    return this.dataSource.transaction(async (trx) => {
      // create block
      const block = trx.getRepository(BlockEntity).create({
        name: dto.name,
        type: dto.type,
        mod: mod
      });
      let saved: BlockEntity;
      try {
        saved = await trx.getRepository(BlockEntity).save(block);
      }
      catch (error) {
        console.error('Error: ', error);
        if (error.code === 'ER_DUP_ENTRY') {
          throw new ConflictException('Block name already exists.')
        }
        throw new InternalServerErrorException();
      }

      // if rf generator...
      if (dto.type === BlockType.RF_GENERATOR) {
        const gen = trx.getRepository(RFGeneratorEntity).create({
          block: { id: saved.id },
          rfPerTick: dto.rfPerTick
        });
        await trx.getRepository(RFGeneratorEntity).save(gen);
      }

      return saved;
    });
  }

  async update(dto: UpdateBlockDTO) {
    const mod = await this.modService.findOne(dto.modName);
    if (!mod) throw new NotFoundException('Mod not found');
    
    if (dto.type === BlockType.RF_GENERATOR && dto.rfGenerator == null) {
      throw new BadRequestException('rfPerTick is required for RF Generators.');
    }

    return this.dataSource.transaction(async (trx) => {
      // create block
      let saved: BlockEntity;
      try {
        saved = await trx.getRepository(BlockEntity).save({
          id: dto.id,
          name: dto.name,
          type: dto.type,
          mod: mod
        });
      }
      catch (error) {
        console.error('Error: ', error);
        if (error.code === 'ER_DUP_ENTRY') {
          throw new ConflictException('Block name already exists.')
        }
        throw new InternalServerErrorException();
      }

      // if rf generator...
      if (dto.type === BlockType.RF_GENERATOR) {
        await trx.getRepository(RFGeneratorEntity).save({
          id: dto.rfGenerator.id,
          rfPerTick: dto.rfGenerator.rfPerTick
        });
      }

      return saved;
    });
  }

  find(): Promise<BlockEntity[]> {
    return this.blockRepository.find({
      relations: {
        mod: true,
        rfGenerator: true
      },
      select: {
        mod: {
          name: true
        },
        rfGenerator: {
          id: true,
          rfPerTick: true
        }
      }
    });
  }
}
