import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PrismaService } from 'src/Prisma/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
    controllers : [PostController],
    providers : [PostService,PrismaService,CloudinaryService]
    
    
})
export class PostModule {

}
