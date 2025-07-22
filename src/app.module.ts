import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { NotesModule } from './notes/notes.module';
import { PaperModule } from './paper/paper.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { SubjectsModule } from './subjects/subjects.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}), AuthModule, UserModule, NotesModule, PaperModule, CloudinaryModule, SubjectsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule { }
