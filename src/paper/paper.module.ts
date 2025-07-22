import { Module } from '@nestjs/common';
import { PaperService } from './paper.service';
import { PaperController } from './paper.controller';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PaperController],
  providers: [PaperService, CloudinaryService, PrismaService],
})
export class PaperModule { }
