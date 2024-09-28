import { FirebaseService } from './../common/firebase.service';
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Upload')
@Controller('api/upload')
export class UploadController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Post()
  @ApiOperation({ summary: 'Upload image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() image: any): Promise<{ url: string }> {
    const imageUrl = await this.firebaseService.uploadFile(image);
    return { url: imageUrl };
  }
}
