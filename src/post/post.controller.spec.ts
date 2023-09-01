import { Test } from "@nestjs/testing";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";

describe("PostController",()=>{
    let postcontroller : PostController
    let postservice : PostService
    beforeEach(async ()=>{
 const modulePost =  await Test.createTestingModule({
    controllers : [PostController],
    providers : [PostService]
 }).compile()
 postservice = modulePost.get<PostService>(PostService);
 postcontroller = modulePost.get<PostController>(PostController);
    })
    describe("findAll",()=>{
        it("Shoul Be Return Array Post",async()=>{
            const result = []
        })
    })
})