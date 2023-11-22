import { IsNotEmpty, Length, Validate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Boolean } from "../../../enums/enum";

export class UpdateProductCategoryDto {
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

    @ApiProperty({ default: Boolean.False })
    isFeatured: number;

    @ApiProperty({ nullable: true, isArray: true, type: "number" })
    arrSubCategories: number[];

    @ApiProperty({ default: Boolean.True })
    isActive: number;
}
