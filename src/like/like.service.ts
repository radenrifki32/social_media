import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/Prisma/prisma.service";
import { jwtConstant } from "src/auth/contsant";
import { ResponseLike } from "./like.inteface";
import { LikeDto } from "./like.dto";
import { Like } from "@prisma/client";

@Injectable()
export class LikeService {
    constructor(private prismaService: PrismaService, private jwtService: JwtService) { };
    async PostLike(likePayload: LikeDto): Promise<ResponseLike> {
        const decodeJwt: string | { [key: string]: any } = await this.jwtService.verifyAsync(likePayload.userId, {
            secret: jwtConstant.secretKey
        });

        let existingLike: Like | null = null;

        try {
            await this.prismaService.$transaction(async (prisma) => {
                existingLike = await prisma.like.findFirst({
                    where: {
                        user_id: decodeJwt.sub,
                        post_id: likePayload.post_id
                    }
                });

                if (existingLike) {
                    await prisma.like.delete({
                        where: {
                            id: existingLike.id,
                            post_id: likePayload.post_id
                        }
                    });
                    await prisma.post.update({
                        where: { id: likePayload.post_id },
                        data: {
                            flag_like: false,

                        }
                    });
                } else {
                    await prisma.like.create({
                        data: {
                            user_id: decodeJwt.sub,
                            post_id: likePayload.post_id
                        }
                    });

                    await prisma.post.update({
                        where: { id: likePayload.post_id },
                        data: {
                            flag_like: true,

                        }
                    });
                }
            });

            const responseMessage: ResponseLike = {
                message: existingLike ? "Berhasil Unlike" : "Berhasil Like"
            };

            return responseMessage;
        } catch (error) {
            console.error("Transaction error:", error);
            throw new Error(error);
        }
    }



}