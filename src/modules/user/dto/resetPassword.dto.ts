import { IsNotEmpty, Length, Validate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordDto {
    @ApiProperty()
    @IsNotEmpty({ message: "Password required" })
    password: string;
}
