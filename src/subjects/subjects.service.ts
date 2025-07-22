import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubjectsService {
    constructor(private readonly prismaService: PrismaService) {}

  createSubject(name: string, level: string, stream: string) {
    const subject = this.prismaService.createSubject(name, level, stream);

    if(!subject) {
      throw new Error(`Failed to create subject with name ${name}`);
    }

    return subject;
  }
}
