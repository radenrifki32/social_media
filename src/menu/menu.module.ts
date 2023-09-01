import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { PrismaService } from 'src/Prisma/prisma.service';
import { MenuController } from './Menu.controller';

@Module({

    controllers : [MenuController],
    providers: [MenuService,PrismaService]
})
export class MenuModule {}
