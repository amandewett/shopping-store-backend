import { IsNotEmpty, Length, Validate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateStateDto {
    @ApiProperty()
    @IsNotEmpty({ message: `state id required` })
    id: number;

    @ApiProperty()
    countryId: number;

    @ApiProperty()
    stateName: string;

    @ApiProperty()
    shipmentPrice: number;
}
