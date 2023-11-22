import { IsNotEmpty, Length, Validate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Boolean } from "../../../enums/enum";

export class AddToCartDto {
    @ApiProperty()
    productId: number;

    @ApiProperty()
    countryId: number;
}
