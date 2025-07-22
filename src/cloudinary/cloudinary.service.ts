import { Injectable, UploadedFile } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');

export interface PdfUploadResult {
    pdf: UploadApiResponse | UploadApiErrorResponse;
    thumbnail?: UploadApiResponse | UploadApiErrorResponse;
}

@Injectable()
export class CloudinaryService {

    private async uploadPdf(@UploadedFile() file: Express.Multer.File, folder: string = 'acelet/pdfs'): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise((resolve, reject) => {
            const upload = v2.uploader.upload_stream({
                resource_type: 'raw',
                folder: folder,
                use_filename: true,
                unique_filename: true
            }, (error, result) => {
                if (error) {
                    return reject(error);
                }

                if (result) {
                    resolve(result);
                } else {
                    reject(new Error('No result returned from Cloudinary.'));
                }
            });

            toStream(file.buffer).pipe(upload);
        });
    }

    async uploadPdfWithThumbnail(@UploadedFile() file: Express.Multer.File, pdfFolder: string = 'acelet/pdfs',
        thumbnailFolder: string = 'acelet/thumbnails'): Promise<PdfUploadResult> {
        try {
            const pdfUpload = await this.uploadPdf(file, pdfFolder);
            const thumbnailUpload = await this.createPdfThumbnail(file, thumbnailFolder, pdfUpload.public_id);

            return {
                pdf: pdfUpload as UploadApiResponse,
                thumbnail: thumbnailUpload
            };
        } catch (error) {
            throw new Error(`PDF upload with thumbnail failed: ${error.message}`);
        }
    }

    private async createPdfThumbnail(file: Express.Multer.File, folder: string, originalPublicId: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise((resolve, reject) => {
            const upload = v2.uploader.upload_stream({
                resource_type: 'image',
                folder: folder,
                public_id: `${originalPublicId}_thumbnail`,
                format: 'jpg',
                pages: '1',
                transformation: [
                    { width: 200, height: 200, crop: 'fit' }
                ]
            }, (error, result) => {
                if (error) {
                    return reject(error);
                }

                if (result) {
                    resolve(result);
                } else {
                    reject(new Error('No result returned from Cloudinary.'));
                }
            });

            toStream(file.buffer).pipe(upload);
        });
    }
}
