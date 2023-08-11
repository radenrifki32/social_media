import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/Prisma/prisma.service";
import { category } from "./categoryDto";
import { Category } from "@prisma/client";

@Injectable()
export class CategoryService {
constructor(private  prismaService : PrismaService){}
async PostCategory(nama_category : string ) : Promise <category>{
    console.log(nama_category)

    try {
        await this.prismaService.category.create({
            data : {
                name_category : nama_category,
            }
        })   
       const message = {
        message : "Success Create Category"
       }
       return message
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }

}

async getAllCategory( ) : Promise <Category[]>{

    try {
       const category = await this.prismaService.category.findMany()
       return category
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }

}
}