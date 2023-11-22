import { IsNotEmpty, Length, Validate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Boolean } from "../../../enums/enum";
import { Column } from "typeorm";

export class UpdateInternationalShipmentDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    priceOne: number;

    @ApiProperty()
    priceTwo: number;
}
