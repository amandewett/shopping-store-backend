import { IsNotEmpty, Length, Validate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ChangeStaffPasswordDto {
    @ApiProperty()
    @IsNotEmpty({ message: "user id required" })
    userId: number;

    @ApiProperty()
    @IsNotEmpty({ message: "New Password required" })
    newPassword: string;
}
