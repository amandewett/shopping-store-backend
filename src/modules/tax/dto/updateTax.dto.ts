import { IsNotEmpty, Length, Validate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Boolean } from "../../../enums/enum";

export class UpdateTaxDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    taxName: string;

    @ApiProperty({ nullable: true })
    taxDescription: string;

    @ApiProperty()
    taxValue: number;
}
