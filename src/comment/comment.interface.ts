import { Prisma } from "@prisma/client";

export type commentPayload = {
    user_id: string;
    post_id: string;
    comment_body: string;
    parent_comment_id?: number | null; 
}
