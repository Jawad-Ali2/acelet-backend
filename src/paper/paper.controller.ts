import { BadRequestException, Body, Controller, Get, NotFoundException, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PaperService } from './paper.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadPaper } from './dto/paper.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiResponse } from 'src/lib';

@Controller('paper')
export class PaperController {
  constructor(private readonly paperService: PaperService, private readonly cloudinaryService: CloudinaryService, private readonly prismaService: PrismaService) { }

  @Get('all')
  async getAllPapers(): Promise<ApiResponse> {
    try {
      const papers = await this.paperService.getAllPapers();
      return { success: true, message: 'Papers fetched successfully', data: papers, meta: { timestamp: new Date().toISOString() } };
    } catch (error) {
      throw new BadRequestException(`Failed to fetch papers: ${error.message}`);
    }
  }


  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPaper(@UploadedFile() file: Express.Multer.File, @Body() body: UploadPaper): Promise<ApiResponse> {
    try {
      const { year, season, paperType, subjectName, subjectId } = body;

      let subject;
      if (subjectName) {
        subject = await this.prismaService.findSubjectByName(subjectName);
      } // Fetch subjectId based on subjectName

      if (subjectId) {
        subject = await this.prismaService.findSubjectById(subjectId);
      } // Validate subjectId

      if (!subject) {
        throw new NotFoundException('Subject not found');
      }

      const { pdf, thumbnail } = await this.cloudinaryService.uploadPdfWithThumbnail(file);
      
      const paper = await this.prismaService.createPaper({
        subjectId: subject.id,
        year,
        season,
        paperType,
        fileURL: pdf.url,
        fileSize: pdf.bytes,
        thumbnailUrl: thumbnail?.url}
      );

      return { success: true, message: 'File uploaded successfully', data: paper, meta: { timestamp: new Date().toISOString() } };
    } catch (error) {
      throw new Error(`File upload failed: ${error.message}`);
    }
  }

}
