import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import CreateModDto from './dto/create-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemEntity } from './item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ModService {
  constructor(
    @InjectRepository(ItemEntity)
    private modRepository: Repository<ItemEntity>
  ) {}

  async create(dto: string) {
    // const entity = this.modRepository.create({ ...dto });
    // try {
    //   return await this.modRepository.save(entity);
    // }
    // catch (error) {
    //   console.error('Error: ', error);
    //   if (error.code === 'ER_DUP_ENTRY') {
    //     throw new ConflictException('Mod name already exists.')
    //   }
    //   throw new InternalServerErrorException();
    // }
  }

  async find(): Promise<ItemEntity[]> {
    try {
      return await this.modRepository.find();
    }
    catch (error) {
      console.error('Error: ', error);
      throw new InternalServerErrorException();
    }
  }

  async findOne(name: string): Promise<ItemEntity> {
    return await this.modRepository.findOneBy({ name: name });
  }
}
