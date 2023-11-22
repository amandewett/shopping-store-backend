import { IsNotEmpty, Length, Validate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AccountVerificationDto {
    @ApiProperty()
    @IsNotEmpty({ message: "Email cannot be empty" })
    email: string;

    @ApiProperty()
    @IsNotEmpty({ message: "OTP missing" })
    otp: string;
}
