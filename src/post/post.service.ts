import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/Prisma/prisma.service";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import { PostDtoBody, PostWithCategory, PostWithCategoryAndUser, ResponsePost } from "./post.dto";
import { jwtConstant } from "src/auth/contsant";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class PostService {

    constructor(private prismaService: PrismaService, private cloudinaryService: CloudinaryService, private jwtService: JwtService) { }
    async PostDataPosting(file: Express.Multer.File, body: PostDtoBody, token: string): Promise<ResponsePost> {
        try {
            const decodeJwt: string | { [key: string]: any } = await this.jwtService.verifyAsync(token, {
                secret: jwtConstant.secretKey
            })
            const urlImage = await this.cloudinaryService.uploadImage(file)
            console.log(urlImage)
            const postData = await this.prismaService.post.create({
                data: {
                    caption: body.caption,
                    image_url: urlImage.url,
                    user: {
                        connect: {
                            id: decodeJwt.sub
                        },
                    },
                    category: {
                        connect: {
                            id: body.id_category
                        }
                    }
                }
            })
            const message: ResponsePost = {
                message: "Berhasil Memposting",
                post_id: postData.id
            }
            return message
        } catch (error) {
            throw new Error(error)
        } finally {
            await this.prismaService.$disconnect
        }

    }
    async GetPost(id_category: string): Promise<PostWithCategoryAndUser[]> {
        try {
            const getAllPostWithCategoryAndUser = await this.prismaService.post.findMany({
                where: {
                    id_category: id_category
                },
                include: {

                    category: {
                        select: {
                            name_category: true
                        }
                    },
                    user: {
                        select: {
                            username: true,
                            email: true
                        }
                    }
                }

            })
            return getAllPostWithCategoryAndUser
        } catch (error) {
            throw new Error(error)
        } finally {
            await this.prismaService.$disconnect
        }

    }
    async yourPost(token: string): Promise<PostWithCategory[]> {
        try {
            const decodeJwt: string | { [key: string]: any } = await this.jwtService.verifyAsync(token, {
                secret: jwtConstant.secretKey
            })
            const YouPost = await this.prismaService.post.findMany({
                where: {
                    user: {
                        id: decodeJwt.sub
                    }
                },
                include: {
                    category: true
                },

            })
            return YouPost
        } catch (error) {
            throw new Error(error)
        } finally {
            await this.prismaService.$disconnect
        }

    }


}