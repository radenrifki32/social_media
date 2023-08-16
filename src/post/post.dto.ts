import { Prisma } from "@prisma/client"

export class PostDtoBody {
    caption : string 
    id_category : string
}

export class ResponsePost {
    message : string
    post_id : string
}
export type PostResponse = { 
    enc : string
}

export type PostWithCategory = Prisma.PostGetPayload<{
    include: {
        category: {
            select : {
                name_category : true
            }
        };
    };
}>;

export type PostWithCategoryAndUser = Prisma.PostGetPayload<{
    include: {
        _count : {
            select : {
                like : true
            }
        },
        
        category: {
            select : {
                name_category : true
            }
        };
        user: {
            select : {
                username : true,
                email : true
            }
        };
    };
}>;
