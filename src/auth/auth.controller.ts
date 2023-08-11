import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards, Headers, Head } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./authDto";
import { HelperResponse } from "src/utils/HelperResponse";
import { Response } from "express";
import { LoginResponse, RegisterResponse } from "./auth.intraface";
import { AuthGuard } from "./auth.guard";
import { User } from "@prisma/client";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {
    }
    @Post("login")
    async Login(@Body() body: AuthDto, @Res() res: Response) {
        const helperResponse = new HelperResponse(res);
        try {
            if (!body.email || !body.password) {
                helperResponse.errorResponse('Field Tidak Boleh Kosong', HttpStatus.BAD_REQUEST);
                return;
            }
            const user = await this.authService.Login(body.email, body.password)
            helperResponse.SuccessResponse<LoginResponse>("Sucsess Login", user, HttpStatus.OK)
        } catch (error) {
            helperResponse.errorResponse(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @Post("register")
    async Register(@Body() body: AuthDto, @Res() res: Response) {
        const helperResponse = new HelperResponse(res);

        try {
            if (!body.username || !body.email || !body.password) {
                helperResponse.errorResponse('Field Tidak Boleh Kosong', HttpStatus.BAD_REQUEST);
                return;
            }

            const config: AuthDto = {
                username: body.username,
                email: body.email,
                password: body.password,
            };
            const user = await this.authService.Register(config);

            if (!user) {
                helperResponse.errorResponse('Email Telah Terdaftar', HttpStatus.BAD_REQUEST);
                return;
            }

            const username = {
                username: user.username,
            };

            helperResponse.SuccessResponse<RegisterResponse>('Success Create User', username, HttpStatus.CREATED);
        } catch (error) {
            helperResponse.errorResponse(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @UseGuards(AuthGuard)
    @Get("profile")
    async getProfile(@Headers() header, @Res() res: Response) {
        const helperResponse = new HelperResponse(res);

        const token = header?.authorization?.split(" ")[1]
        const user = await this.authService.profile(token)
        helperResponse.SuccessResponse<User>("Sucsess Login", user, HttpStatus.OK)

    }
}
