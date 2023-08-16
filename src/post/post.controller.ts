import { Controller,Post,UploadedFile,UseInterceptors,Body, Headers, Res, HttpStatus, UseGuards, Get, Param, ParseIntPipe, Head } from "@nestjs/common";
import { PostService } from "./post.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { PostDtoBody, PostResponse, PostWithCategory, PostWithCategoryAndUser, ResponsePost } from "./post.dto";
import { HelperResponse } from "src/utils/HelperResponse";
import { Response } from "express";
import { AuthGuard } from "src/auth/auth.guard";

@UseGuards(AuthGuard)
@Controller("Post")
export class PostController {
    constructor(private readonly postService : PostService){}
    @Post("create")
    @UseInterceptors(FileInterceptor("file"))
 async createPost(@UploadedFile() file : Express.Multer.File, @Body() body :PostDtoBody , @Headers() header, @Res() res : Response) {
    const helperResponse = new HelperResponse(res);
    try {
        const token = header?.authorization?.split(" ")[1]
        const DataPost = await this.postService.PostDataPosting(file,body,token)
        helperResponse.SuccessResponse<ResponsePost>("Berhasil Upload Post",DataPost,HttpStatus.OK)
        
    } catch (error) {
        console.log(error)
        helperResponse.errorResponse(error,HttpStatus.INTERNAL_SERVER_ERROR)
    }
 } 
 @Get("")
 async getPost(@Res() res : Response ,@Param("id_category") id_category,@Headers() header) {
    const helperResponse = new HelperResponse(res);
try {
    const token = header?.authorization?.split(" ")[1]

    const post : PostWithCategoryAndUser[] = await this.postService.GetPost(id_category,token)
    helperResponse.SuccessResponse<PostWithCategoryAndUser[]>("Berhasil", post , HttpStatus.OK)   
} catch (error) {
    helperResponse.errorResponse(error,HttpStatus.INTERNAL_SERVER_ERROR)
}
   

 }
 @Get("yourpost")
 async yourPost(@Headers() header, @Res() res : Response){
    const helperResponse = new HelperResponse(res);

    try {
        const token = header?.authorization?.split(" ")[1]
        const YourPost = await this.postService.yourPost(token)
        helperResponse.SuccessResponse<PostWithCategory[]>("Berhasil", YourPost,HttpStatus.OK)

    } catch (error) {
        helperResponse.errorResponse(error,HttpStatus.INTERNAL_SERVER_ERROR)
    }
 }
 @Get("/:id")
 async GetPostById ( @Param('id') id , @Res() res :Response, @Headers() header){
    const token = header?.authorization?.split(" ")[1]

    const helperResponse = new HelperResponse(res);
try {
    const postById = await this.postService.postById(id);
     helperResponse.SuccessResponse<PostWithCategoryAndUser>("Berhasil",postById,HttpStatus.OK)  
} catch (error) {
    helperResponse.errorResponse(error,HttpStatus.INTERNAL_SERVER_ERROR)
}
  

 }

}