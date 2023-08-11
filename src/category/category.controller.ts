import { Body, Controller, Get, HttpStatus, Post, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { Response } from "express";
import { CategoryResponse } from "./category.interface";
import { CategoryService } from "./category.service";
import { Category } from "@prisma/client";
import { HelperResponse } from "src/utils/HelperResponse";


@UseGuards(AuthGuard)
@Controller("category")


export class CategoryController {
    constructor(private categoryService : CategoryService){}
@Post("create")
async  PostCategory(@Body() body :Category, @Res() res : Response )  {
    const helperResponse = new HelperResponse(res);

    try {
        const category = await this.categoryService.PostCategory(body.name_category)
        helperResponse.SuccessResponse<CategoryResponse>("Success",category,HttpStatus.OK)
    } catch (error) {
        helperResponse.errorResponse(error,HttpStatus.INTERNAL_SERVER_ERROR)
    }
  
}   

@Get()
async getAllCategory(@Res() res : Response){
    const helperResponse = new HelperResponse(res);

    try {
        const allCategory = await this.categoryService.getAllCategory()
        helperResponse.SuccessResponse<Category[]>("Success",allCategory,HttpStatus.OK)
    } catch (error) {
        
    }


}

}