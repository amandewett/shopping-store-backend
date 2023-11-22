import { IsNotEmpty, Length, Validate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty()
    @IsNotEmpty({ message: "Email cannot be empty" })
    email: string;

    @ApiProperty()
    @IsNotEmpty({ message: "Password cannot be empty" })
    @Length(8)
    password: string;
}
