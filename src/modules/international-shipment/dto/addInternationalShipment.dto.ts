import { IsNotEmpty, Length, Validate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Boolean } from "../../../enums/enum";
import { Column } from "typeorm";

export class AddInternationalShipmentDto {
    @ApiProperty()
    countryName: string;

    @ApiProperty()
    countryCode: string

    @ApiProperty()
    countryImage: string;

    @ApiProperty()
    priceOne: number;

    @ApiProperty()
    priceTwo: number;
}
