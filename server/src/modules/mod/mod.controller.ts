import { Body, Controller, Get, Post } from '@nestjs/common';
import { ModService } from './mod.service';
import CreateModDto from './dto/create-mod.dto';

@Controller('mods')
export class ModController {
  constructor(private readonly modService: ModService) {}

  @Post()
  create(@Body() dto: CreateModDto) {
    return this.modService.create(dto);
  }

  @Get()
  find() {
    return this.modService.find();
  }
}
