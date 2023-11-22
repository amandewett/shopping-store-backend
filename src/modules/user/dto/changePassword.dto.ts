import { IsNotEmpty, Length, Validate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ChangePasswordDto {
    @ApiProperty()
    @IsNotEmpty({ message: "Old Password required" })
    oldPassword: string;

    @ApiProperty()
    @IsNotEmpty({ message: "New Password required" })
    newPassword: string;
}
