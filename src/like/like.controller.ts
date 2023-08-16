import { Body, Controller, Headers, HttpStatus, Post, Res, UseGuards } from "@nestjs/common";
import { LikeService } from "./like.service";
import { HelperResponse } from "src/utils/HelperResponse";
import { Response } from "express";
import { LikeDto } from "./like.dto";
import { ResponseLike } from "./like.inteface";
import { AuthGuard } from "src/auth/auth.guard";
@Controller("like")    
@UseGuards(AuthGuard)

export class LikeController {
    constructor(private likeService : LikeService){}

@Post("create")
async LikePost(@Headers() header , @Res() res : Response, @Body() body:LikeDto){
    const response = new HelperResponse(res);

    try {
        const token = header?.authorization?.split(" ")[1]
        const payload :LikeDto = {
            userId : token, 
            post_id : body.post_id
        }
        const message =  await this.likeService.PostLike(payload)    
        response.SuccessResponse<ResponseLike>("Behasil",message,HttpStatus.OK)      
    } catch (error) {
response.errorResponse(error,HttpStatus.INTERNAL_SERVER_ERROR)
    }
  

}
}