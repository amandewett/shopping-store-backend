import { IsNotEmpty, Length, Validate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateStaffUserDto {
    @ApiProperty()
    id: number;

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
    phone: string;

    @ApiProperty()
    role: string;
}
