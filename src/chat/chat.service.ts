import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/Prisma/prisma.service";
import { Socket, Server } from 'socket.io';
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { jwtConstant } from "src/auth/contsant";
import { User } from "@prisma/client";

interface ChatServiceImpl {
    getUserWebSocket(token : Socket) : Promise<User>
    createRoom()
}

@Injectable()
export class ChatService implements ChatServiceImpl {
constructor(private prismaService : PrismaService,private jwtservice : JwtService){}
 async getUserWebSocket(token: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) : Promise<User>  {
        let headerToken = token.handshake.headers.authorization
        console.log(headerToken)

        if(!headerToken){
            throw new Error("token Not Provide")
        }
        const decodeJwt: string | { [key: string]: any } = await this.jwtservice.verifyAsync(headerToken, {
            secret: jwtConstant.secretKey
        });
        if(!decodeJwt.sub){
            throw new Error("Inavalid Credentials")
        }
       const getUser =    this.prismaService.user.findFirst({
            where : {
                id : decodeJwt.sub
            }
        })

return getUser
 }
 createRoom() {

 }
}

