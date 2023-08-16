import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/Prisma/prisma.service";
import { FavoriteWithPostAndUser, payloadFavorite, responseFavorite } from "./favorite.interface";
import { jwtConstant } from "src/auth/contsant";

@Injectable()
export class FavoriteService {
    constructor(private prismaService: PrismaService, private jwtService: JwtService) { }
    async addFavorite(payloadFavorite: payloadFavorite): Promise<responseFavorite> {
        const decodeJwt: string | { [key: string]: any } = await this.jwtService.verifyAsync(payloadFavorite.user_id, {
            secret: jwtConstant.secretKey
        });
        const existingFavorite = await this.prismaService.favorite.findFirst({
            where: {
                user_post: decodeJwt.sub,
                post_id: payloadFavorite.post_id
            }
        })
        if (existingFavorite) {
            await this.prismaService.favorite.delete({
                where: {
                    id: existingFavorite.id,
                    user_post: existingFavorite.user_post,
                    post_id: existingFavorite.post_id

                }
            })
        } else {
            await this.prismaService.favorite.create({
                data: {
                    post: {
                        connect: {
                            id: payloadFavorite.post_id
                        }

                    },
                    user: {
                        connect: {
                            id: decodeJwt.sub
                        }
                    }

                }
            })
        }
        return {
            message: existingFavorite ? "Success Delete Favorite" : "Sucess Add Favorite"
        }

    }
    async getFavorite(token: string): Promise<FavoriteWithPostAndUser[]> {

        const decodeJwt: string | { [key: string]: any } = await this.jwtService.verifyAsync(token, {
            secret: jwtConstant.secretKey
        });
        console.log(decodeJwt.sub)
        const getFavoriteUser = await this.prismaService.favorite.findMany({
            where: {
                user_post: decodeJwt.sub
            },
            include: {
                post: {
                    include: {
                        _count: {
                            select: {
                                like: true
                            }
                        },
                        user: {
                            select: {
                                username: true,
                                email: true
                            }
                        },
                        comment: {
                            where: {
                                parent_comment_id: null
                            },
                            include: {
                                children: {
                                    include: {
                                        children: {
                                            select: {
                                                comment_body: true,
                                                parent_comment_id: true
                                            }
                                        }
                                    }
                                }
                            },

                        }
                    }
                }
            }
        })
        return getFavoriteUser
    }
}