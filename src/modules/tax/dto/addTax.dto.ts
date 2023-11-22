import { IsNotEmpty, Length, Validate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Boolean } from "../../../enums/enum";

export class AddTaxDto {
    @ApiProperty()
    taxName: string;

    @ApiProperty({ nullable: true })
    taxDescription: string;

    @ApiProperty()
    taxValue: number;

    @ApiProperty()
    countryId: number;
}
