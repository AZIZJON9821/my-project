import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Express } from 'express';

@Injectable()
export class ParseFilePipe implements PipeTransform {
  constructor(
    private readonly allowedMimeTypes: string[] = ['image/png', 'image/jpeg'],
    private readonly maxSizeInBytes = 2 * 1024 * 1024, 
  ) {}

  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Fayl yuborilmadi');
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Fayl turi noto'g'ri (hozirgi tur: ${file.mimetype}, ruxsat berilgan: ${this.allowedMimeTypes.join(', ')})`,
      );
    }

    if (file.size > this.maxSizeInBytes) {
      throw new BadRequestException(
        `Fayl hajmi ${this.maxSizeInBytes / 1024 / 1024} MB dan oshmasligi kerak`,
      );
    }

    return file;
  }
}
