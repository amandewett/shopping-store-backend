import { IsNotEmpty, Length, Validate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Boolean } from "../../../enums/enum";

export class UpdateProductDto {
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

    @ApiProperty()
    categoryId: number;

    @ApiProperty()
    subCategoryId: number;

    @ApiProperty({ nullable: true })
    price: number;

    @ApiProperty({ nullable: true })
    arrMedia: string[];

    @ApiProperty({ default: Boolean.False })
    isFeatured: number;

    @ApiProperty({ default: Boolean.False })
    isNewArrival: number;

    @ApiProperty({ default: Boolean.False })
    isPackage: number;

    @ApiProperty()
    weight: number;
}
