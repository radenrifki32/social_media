import { Body, Controller, Get, Headers, HttpStatus, Post, Res, UseGuards } from "@nestjs/common";
import { FavoriteService } from "./favorite.service";
import { FavoriteWithPostAndUser, payloadFavorite, responseFavorite } from "./favorite.interface";
import { Response } from "express";
import { HelperResponse } from "src/utils/HelperResponse";
import { AuthGuard } from "src/auth/auth.guard";
@Controller("favorite")
@UseGuards(AuthGuard)
export class FavoriteController {
constructor(private favoriteService : FavoriteService){}
@Post("add")
async addFavorite(@Body() body  , @Headers() header, @Res() res : Response){
    const helperResponse = new HelperResponse(res)
    const token = header?.authorization?.split(" ")[1]
    const config : payloadFavorite = {
        post_id : body.post_id,
        user_id : token
    }
 const message =    await this.favoriteService.addFavorite(config)
 helperResponse.SuccessResponse<responseFavorite>("success", message,HttpStatus.OK)
}
@Get("")
async getFavorite( @Headers() header, @Res() res : Response){
    const helperResponse = new HelperResponse(res)
    const token = header?.authorization?.split(" ")[1]
 const data =    await this.favoriteService.getFavorite(token)
 helperResponse.SuccessResponse<FavoriteWithPostAndUser[]>("success", data,HttpStatus.OK)
}
}