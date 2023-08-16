import { Prisma } from "@prisma/client"

export class payloadFavorite { 
    post_id : string
    user_id : string 
}

export class responseFavorite {
    message : string
}
const FavoriteInclude = Prisma.validator<Prisma.FavoriteInclude>()({
    post : {
        include : {
            _count : {
                select : {
                    like : true
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
    }
})
export type FavoriteWithPostAndUser = Prisma.FavoriteGetPayload<{
    include : typeof FavoriteInclude
}>