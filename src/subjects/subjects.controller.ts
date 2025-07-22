import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/subject.dto';
import { ApiResponse } from 'src/lib';

@Controller('subject')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) { }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createSubject(@Body() body: CreateSubjectDto): Promise<ApiResponse> {
    if (!body.name || !body.level || !body.stream) {
      throw new BadRequestException('Name, level, and stream are required to create a subject.');
    }

    const subject = await this.subjectsService.createSubject(body.name, body.level, body.stream);

    return {
      success: true,
      message: 'Subject created successfully',
      data: subject,
      meta: {
        timestamp: new Date().toISOString(),
      }
    };
  }
}
