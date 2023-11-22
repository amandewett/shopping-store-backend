import { IsNotEmpty, Length, Validate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class FileDeleteDto {
    @ApiProperty()
    filePath: string;
}
