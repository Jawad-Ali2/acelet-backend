import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(private readonly prismaServer: PrismaService, private readonly jwtService: JwtService) { }

    async validateUser(username: string, password: string) {
        console.log('Validating user:', username);

        // Check if credentials match environment variables
        if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
            // Return user data if valid
            return { username };
        }

        // Return null if credentials are invalid (this will result in 401)
        return null;
    }

    async login(username: string) {
        const accessToken = await this.generateToken(username);

        return {
            access_token: accessToken,
            username: username
        };
    }

    async generateToken(username) {
        const payload = { sub: username };

        const accessToken = await this.jwtService.signAsync(payload);


        return accessToken;
    }
}
