import { IsNotEmpty, Length, Validate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateProductSubCategoryDto {
    @ApiProperty()
    englishName: string;

    @ApiProperty()
    arabicName: string;

    @ApiProperty({ nullable: true })
    englishDescription: string;

    @ApiProperty({ nullable: true })
    arabicDescription: string;
}
