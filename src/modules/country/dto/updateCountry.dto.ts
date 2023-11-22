import { IsNotEmpty, Length, Validate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateCountryDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    countryName: string;

    @ApiProperty()
    countryCode: string;

    @ApiProperty()
    currencyName: string;

    @ApiProperty()
    currencyCode: string;

    @ApiProperty()
    currencyCodeInArabic: string;

    @ApiProperty({ nullable: true })
    image: string;

    @ApiProperty()
    defaultLanguage: string;

    @ApiProperty()
    phoneNumber: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    latitude: string;

    @ApiProperty()
    longitude: string;
}
