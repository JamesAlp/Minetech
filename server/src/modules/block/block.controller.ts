import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { BlockService } from './block.service';
import { BlockEntity } from './block.entity';
import CreateBlockDTO from './dto/create-block.dto';
import UpdateBlockDTO from './dto/update-block.dto';

@Controller('blocks')
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @Post()
  create(@Body() dto: CreateBlockDTO) {
    return this.blockService.create(dto);
  }

  @Put()
  update(@Body() dto: UpdateBlockDTO) {
    return this.blockService.update(dto);
  }

  @Get()
  find(): Promise<BlockEntity[]> {
    return this.blockService.find();
  }
}
