import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaService } from "src/Prisma/prisma.service";
import { Encyption } from "src/utils/EncryptAndDecrypt";
import { UserModule } from "src/user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstant } from "./contsant";
@Module({
    imports : [UserModule,JwtModule.register({
        global : true,
        secret : jwtConstant.secretKey,
        signOptions : {
            algorithm : "HS256",
            expiresIn : '1h'
        }
    })],
    controllers : [AuthController],
    providers : [AuthService,PrismaService,Encyption]
})
export class AuthModule {

}