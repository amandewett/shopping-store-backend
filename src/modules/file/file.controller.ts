import { Body, Controller, HttpCode, Get, Post, Put, UsePipes, UseInterceptors, ValidationPipe, UseGuards, Request, Param, ParseIntPipe, Query, DefaultValuePipe, UploadedFile, } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiQuery, ApiParam, ApiConsumes, ApiProperty } from '@nestjs/swagger';
import { Roles } from 'src/enums/enum';
import { Role } from "../../middleware/decorator/role.decorator";
import { AuthGuard } from 'src/middleware/authGuard.service';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileDeleteDto } from './dto/fileDelete.dto';

@Controller('file')
@ApiTags('file')
export class FileController {
    constructor(
        private readonly fileService: FileService,
    ) { }

    @Post('/upload')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
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
    @ApiOperation({ summary: "upload a file" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<any> {
        return await this.fileService.uploadFile(file);
    }

    @Post('/delete')
    @ApiOperation({ summary: "delete a file" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async deleteFile(@Body() data: FileDeleteDto): Promise<any> {
        return await this.fileService.deleteFile(data);
    }
}
