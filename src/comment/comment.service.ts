import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/Prisma/prisma.service";
import { commentPayload } from "./comment.interface";
import { jwtConstant } from "src/auth/contsant";
import { JwtService } from "@nestjs/jwt";
import { Comment, Prisma } from "@prisma/client";

@Injectable()
export class CommentService{
constructor(private prismaService : PrismaService,private jwtService : JwtService){}
async createComment(payloadComment: commentPayload): Promise<void> {
    const decodeJwt: string | { [key: string]: any } = await this.jwtService.verifyAsync(payloadComment.user_id, {
        secret: jwtConstant.secretKey
    });

    const commentCreate = await this.prismaService.comment.create({
        data: {
            comment_body: payloadComment.comment_body,
            user: {
                connect: {
                    id: decodeJwt.sub
                }
            },
            post: {
                connect: {
                    id: payloadComment.post_id
                }
            },
            parent: payloadComment.parent_comment_id !== null ? {
                connect: {
                    id: payloadComment.parent_comment_id
                }
            } : undefined
        }
    });
    
    

}

}