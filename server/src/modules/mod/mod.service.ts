import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import CreateModDto from './dto/create-mod.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ModEntity } from './mod.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ModService {
  constructor(
    @InjectRepository(ModEntity)
    private modRepository: Repository<ModEntity>
  ) {}

  async create(dto: CreateModDto): Promise<ModEntity> {
    const entity = this.modRepository.create({ ...dto });
    try {
      return await this.modRepository.save(entity);
    }
    catch (error) {
      console.error('Error: ', error);
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Mod name already exists.')
      }
      throw new InternalServerErrorException();
    }
  }

  async find(): Promise<ModEntity[]> {
    try {
      return await this.modRepository.find();
    }
    catch (error) {
      console.error('Error: ', error);
      throw new InternalServerErrorException();
    }
  }

  async findOne(name: string): Promise<ModEntity> {
    return await this.modRepository.findOneBy({ name: name });
  }
}
