import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/Prisma/prisma.service";

@Module({
    providers : [ChatGateway,ChatService,JwtService,PrismaService,ChatGateway],
    controllers : [],


})
export class ChatModule {}
