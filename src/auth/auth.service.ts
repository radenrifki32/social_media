import { Injectable, UnauthorizedException } from "@nestjs/common";
import { User, Prisma } from "@prisma/client";
import { PrismaService } from "src/Prisma/prisma.service";
import { Encyption } from "src/utils/EncryptAndDecrypt";
import { JwtService } from "@nestjs/jwt";

import { AuthDto } from "./authDto";
import { LoginResponse } from "./auth.intraface";
import { jwtConstant } from "./contsant";
import { ZodError } from "zod";
@Injectable({})
export class AuthService {

    constructor(private prismaService: PrismaService, private jwtService: JwtService) { }

    async Register({ username, email, password }: AuthDto): Promise<User | null> {
        try {
            const user = await this.prismaService.user.findUnique({
                where: {
                    email: email,
                },
            });
            if (user) {
                throw new Error('User with this email already exists.');
            }
            const hashingPassword = new Encyption().hashingPassword(password);
            const newUser = await this.prismaService.user.create({
                data: {
                    username: username,
                    password: hashingPassword,
                    email: email,
                },
            });
            return newUser;
        } catch (error) {
            if (error.code === 'P2002') {
                throw new Error('User with this email already exists.');
            }
            if(error instanceof ZodError){
                throw new Error("Error Dari Zod")
            }
            throw error;
        }
    }

    async Login(email: string, password: string): Promise<LoginResponse | null> {
        const user = await this.prismaService.user.findFirst({
            where: {
                email: email
            }
        })
        if (!user) {
            throw new UnauthorizedException();
        }
        const comparePassword = new Encyption().comparePassword(password, user.password)
        if (!comparePassword) {
            throw new UnauthorizedException();
        }
        const payload = { sub: user.id, username: user.username, email: user.email }
        const token = await this.jwtService.signAsync(payload, {
            secret: jwtConstant.secretKey,

        })
        return {
            username: user.username,
            email: user.email,
            access_token: token
        }


    }
    async profile(token: string): Promise<User | null> {
        try {
            const decodeJwt: string | { [key: string]: any } = await this.jwtService.verifyAsync(token, {
                secret: jwtConstant.secretKey
            })
            const profileSelect = {
                email: true,
                username: true,
                id: true
            } satisfies Prisma.UserSelect
            type MyProfile = Prisma.UserGetPayload<{ select: typeof profileSelect }>
            const getUser: MyProfile = await this.prismaService.user.findFirst({
                where: {
                    id: decodeJwt.sub
                },
                select: profileSelect
            })


            return getUser as User
        } catch (error) {
            throw new Error()
        }

    }
}