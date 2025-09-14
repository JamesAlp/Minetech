import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModModule } from './modules/mod/mod.module';
import { BlockModule } from './modules/block/block.module';
import { WsModule } from './ws/ws.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'database',
      port: 3306,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      autoLoadEntities: true,
      synchronize: true // dev only
    }),
    ModModule,
    BlockModule,
    WsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
