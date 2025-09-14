import { Body, Controller, Get, Post } from '@nestjs/common';
import { ModService } from './item.service';

@Controller('mods')
export class ModController {
  constructor(private readonly modService: ModService) {}

  @Post()
  create(@Body() dto: string) {
    return this.modService.create(dto);
  }

  @Get()
  find() {
    return this.modService.find();
  }
}
