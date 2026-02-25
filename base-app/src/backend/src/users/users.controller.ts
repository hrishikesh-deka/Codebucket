import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('login')
    async login(@Body('email') email: string) {
        if (!email || typeof email !== 'string' || !email.includes('@')) {
            throw new BadRequestException('Valid email address is required.');
        }

        const user = await this.usersService.loginOrRegister(email);
        return {
            message: 'Login successful',
            user: {
                email: user.email,
                lastLoginAt: user.lastLoginAt,
                createdAt: user.createdAt,
            }
        };
    }
}
