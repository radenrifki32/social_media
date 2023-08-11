import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { PostModule } from './post/post.module';
import { ZodValidationPipe } from 'nestjs-zod'
import { APP_PIPE } from '@nestjs/core'
import { ThrottlerModule } from '@nestjs/throttler';


@Module({
  imports: [AuthModule,UserModule, BookmarkModule,CategoryModule, CloudinaryModule,PostModule,ThrottlerModule.forRoot({
    ttl : 60,
    limit : 10
  })],
  providers :[
   
  ]
})
export class AppModule {}
