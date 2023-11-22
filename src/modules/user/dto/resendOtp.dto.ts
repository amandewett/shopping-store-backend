import { IsNotEmpty, Length, Validate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ResendOtpDto {
    @ApiProperty()
    @IsNotEmpty({ message: "Email cannot be empty" })
    email: string;
}
