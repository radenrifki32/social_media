import { Injectable } from "@nestjs/common";
import { Menu } from "@prisma/client";
import { PrismaService } from "src/Prisma/prisma.service";
import { MenuDTO } from "./menuDto";
@Injectable()
export class MenuService {
    constructor(private prismaService : PrismaService) {}
async getMenu () : Promise<Menu[]>{
    const SelectMenu = await this.prismaService.menu.findMany({
        include : {
            children : true
        }
    })
    return SelectMenu
}

async PostMenu (menu : MenuDTO) : Promise<Menu> {
   const createMenu =   await this.prismaService.menu.create({
        data : {
            name_menu : menu.name_menu,
            url_menu : menu.url_menu,
            icon_menu : menu.icon_menu,
            parent_menu : menu.parent_menu_id !== null ? {
                connect : {
                    id : menu.parent_menu_id
                }
            } : undefined
        }
    })
    return  createMenu

}
}
