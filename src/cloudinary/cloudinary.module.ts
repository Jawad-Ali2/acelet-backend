import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryProvider } from './cloudinary.provider';

@Module({
  controllers: [CloudinaryController],
  exports: [CloudinaryService, CloudinaryProvider],
  providers: [CloudinaryService, CloudinaryProvider],
})
export class CloudinaryModule { }
