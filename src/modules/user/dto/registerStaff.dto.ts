import { IsNotEmpty, Length, Validate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterStaffDto {
    @ApiProperty({
        nullable: true
    })
    email: string;

    @ApiProperty({
        nullable: true
    })
    password: string;

    @ApiProperty({
        nullable: true
    })
    firstName: string;

    @ApiProperty({
        nullable: true
    })
    lastName: string;

    @ApiProperty()
    countryId: number;

    @ApiProperty({
        nullable: true
    })
    phone: string;

    @ApiProperty()
    role: string;

    @ApiProperty({ default: [] })
    staffRights: string[];
}
