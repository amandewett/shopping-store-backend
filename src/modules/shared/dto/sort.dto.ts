import { IsNotEmpty, Length, Validate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Roles } from "src/enums/enum";

export class SortDto {
    @ApiProperty({ default: "DESC" })
    orderBy: string;

    @ApiProperty({ nullable: true })
    role: string;

    @ApiProperty({ nullable: true })
    countryId: number;
}
