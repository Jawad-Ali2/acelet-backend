import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaperService {
    constructor(private readonly prismaService: PrismaService) { }

    async getAllPapers() {
        return await this.prismaService.getAllPapers();
    }
}
