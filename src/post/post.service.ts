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
    async GetPost(id_category?: string,token? : string): Promise<PostWithCategoryAndUser[]> {
        try {
            const decodeJwt: string | { [key: string]: any } = await this.jwtService.verifyAsync(token, {
                secret: jwtConstant.secretKey
            })
            let postQuery = {
                include: {
                    _count : {
                        select : {
                            like : true
                        }
                      },
                   
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
                    },
                    comment : {
                        where : {
                            parent_comment_id : null 
                        },
                        include : {
                            children : {
                                include : {
                                    children : {
                                        select : {
                                            comment_body : true,
                                            parent_comment_id : true
                                        }
                                    }
                                }
                            }
                        },
                        
                    }
                }
            };
    
            if (id_category) {
                postQuery['where'] = {
                    id_category: id_category
                };
            }
    
            const getAllPostWithCategoryAndUser = await this.prismaService.post.findMany(postQuery);
    
            return getAllPostWithCategoryAndUser;
        } catch (error) {
            console.log(error)
            throw new Error(error);
        } finally {
            await this.prismaService.$disconnect();
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

    async postById (id :string,) : Promise<PostWithCategoryAndUser> {
       
        const post = await this.prismaService.post.findFirst({
            where : {
             id  : id
            },
            include : {
                _count : {
                    select : {
                        like :true
                    },
                },
               
                user : {
                    select : {
                        username : true ,
                        email : true
                    }
                },
                category : {
                    select : { 
                        name_category : true
                    }
                }
            }
        })
return post
    }
    


}