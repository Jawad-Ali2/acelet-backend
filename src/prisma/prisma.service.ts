
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

type CreatePaperType = {
    subjectId: string;
    year: number;
    season: string;
    paperType: string;
    fileURL: string;
    fileSize: number;
    thumbnailUrl?: string;
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        await this.$connect();
    }


    // Subject-related methods
    async createSubject(name: string, level: string, stream: string) {
        return await this.subject.create({
            data: {
                name,
                level,
                stream
            },
        });
    }

    async findSubjectByName(subjectName: string) {
        const subject = await this.subject.findFirst({ where: { name: subjectName } });

        if (!subject) {
            throw new Error(`Subject with name ${subjectName} not found`);
        }

        return subject;
    }

    async findSubjectById(subjectId: string) {
        const subject = await this.subject.findUnique({ where: { id: subjectId } });

        if (!subject) {
            throw new Error(`Subject with ID ${subjectId} not found`);
        }

        return subject;
    }

    // Paper-related methods
    async createPaper(data: CreatePaperType) {
        return this.paper.create({
            data: {
                subjectId: data.subjectId,
                year: data.year,
                season: data.season,
                paperType: data.paperType,
                fileURL: data.fileURL,
                fileSize: data.fileSize,
                thumbnailUrl: data.thumbnailUrl
            }
        });
    }

    getAllPapers() {
        return this.paper.findMany({
            include: {
                subject: true,
            },
        });
    }
}
