import { Body, Controller, Get, HttpStatus, Post, Res } from "@nestjs/common";
import { MenuService } from "./menu.service";
import { Response } from "express";
import { HelperResponse } from "src/utils/HelperResponse";
import { MenuDTO } from "./menuDto";

@Controller("menu")
export class MenuController {
 constructor(private menuService : MenuService){}

@Get("getmenu")
 async GetMenu(@Res() res : Response){
    const helperResponse = new HelperResponse(res)
  const menu  = await this.menuService.getMenu()
  helperResponse.SuccessResponse("Berhasil",menu,HttpStatus.OK)

 }

@Post("postmenu")
async PostMenu(@Body() body : MenuDTO ,@Res() res : Response){
    const helperResponse = new HelperResponse(res)
    const createMenu = await this.menuService.PostMenu(body)
    helperResponse.SuccessResponse("Berhasil",createMenu,HttpStatus.OK)


}


}
