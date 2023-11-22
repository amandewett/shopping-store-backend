import { IsNotEmpty, Length, Validate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterUserDto {
    @ApiProperty()
    id: number;

    @ApiProperty({
        nullable: true
    })
    email: string;

    @ApiProperty({
        nullable: true
    })
    firstName: string;

    @ApiProperty({
        nullable: true
    })
    lastName: string;

    @ApiProperty({
        nullable: true
    })
    googleId: string;

    @ApiProperty({
        nullable: true
    })
    facebookId: string;

    @ApiProperty({
        nullable: true
    })
    appleId: string;

    @ApiProperty({
        nullable: true
    })
    password: string;

    @ApiProperty({
        nullable: true
    })
    phone: string;

    @ApiProperty()
    registrationType: number;

    @ApiProperty()
    countryId: number;
}
