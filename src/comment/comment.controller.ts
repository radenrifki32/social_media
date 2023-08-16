import { Body, Controller, Headers, HttpStatus, Post, Res, UseGuards } from "@nestjs/common";
import { CommentService } from "./comment.service";
import {  commentPayload } from "./comment.interface";
import { Response } from "express";
import { HelperResponse } from "src/utils/HelperResponse";
import { AuthGuard } from "src/auth/auth.guard";
@UseGuards(AuthGuard)

@Controller("comment")
export class CommentController {
    constructor(private commentService : CommentService){}
@Post("post")
async commentPost(@Body() body : commentPayload,@Headers() header,@Res() res : Response){
    const helperResponse = new HelperResponse(res)
    const token = header?.authorization?.split(" ")[1];
    const config = {
        user_id : token,
        post_id : body.post_id,
        comment_body : body.comment_body,
        parent_comment_id : body.parent_comment_id
    }
    const testing = await this.commentService.createComment(config)
    helperResponse.SuccessResponse<any>("success",testing ,HttpStatus.OK)

}

}