import { IsNotEmpty, Length, Validate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Boolean } from "../../../enums/enum";
import { Column } from "typeorm";

export class AddCouponDto {
    @ApiProperty()
    couponName: string;

    @ApiProperty()
    couponNameInArabic: string;

    @ApiProperty()
    couponDescription: string;

    @ApiProperty()
    couponDescriptionInArabic: string;

    @ApiProperty()
    couponPercent: number;

    @ApiProperty()
    countryId: number;

    @ApiProperty()
    expiryDate: Date;

    @ApiProperty()
    minCartValue: number;

    @ApiProperty()
    couponType: number;
}
