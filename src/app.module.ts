import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { PostModule } from './post/post.module';

import { ThrottlerModule } from '@nestjs/throttler';
import { LikeModule } from './like/like.module';
import { CommentModule } from './comment/comment.module';
import { FavoriteModule } from './favorite/favorite.module';
import { MenuModule } from './menu/menu.module';
import { ChatGateway } from './chat/chat.gateway';
import { ChatModule } from './chat/chat.module';


@Module({
  imports: [AuthModule,UserModule, BookmarkModule,CategoryModule, CloudinaryModule,PostModule,ThrottlerModule.forRoot({
    ttl : 60,
    limit : 10
  }), LikeModule, CommentModule, FavoriteModule, MenuModule,ChatModule],
})
export class AppModule {}
