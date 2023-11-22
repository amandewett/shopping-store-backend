import { IsNotEmpty, Length, Validate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AddStateDto {
    @ApiProperty()
    countryId: number;

    @ApiProperty()
    stateName: string;

    @ApiProperty()
    shipmentPrice: number;
}
