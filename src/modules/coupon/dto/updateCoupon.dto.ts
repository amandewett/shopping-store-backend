import { IsNotEmpty, Length, Validate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Boolean } from "../../../enums/enum";
import { Column } from "typeorm";

export class UpdateCouponDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    couponName: string;

    @ApiProperty()
    couponDescription: string;

    @ApiProperty()
    couponNameInArabic: string;

    @ApiProperty()
    couponDescriptionInArabic: string;

    @ApiProperty()
    couponPercent: number;

    @ApiProperty()
    expiryDate: Date;

    @ApiProperty()
    minCartValue: number;
}
