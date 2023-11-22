import { IsNotEmpty, Length, Validate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateProductSubCategoryDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    englishName: string;

    @ApiProperty()
    arabicName: string;

    @ApiProperty({ nullable: true })
    englishDescription: string;

    @ApiProperty({ nullable: true })
    arabicDescription: string;

    @ApiProperty({ nullable: true })
    isActive: number;
}
