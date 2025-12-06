import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@UseGuards(JwtAuthGuard)
@Controller('admin/uploads')
export class UploadsController {
  constructor(private uploadsService: UploadsService) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: MulterFile) {
    if (!file) {
      throw new Error('No file uploaded. Please ensure the field name is "file"');
    }
    console.log(process.env.LIARA_ACCESS_KEY);
    const url = await this.uploadsService.uploadFile(file);
    return { url };
  }
}
