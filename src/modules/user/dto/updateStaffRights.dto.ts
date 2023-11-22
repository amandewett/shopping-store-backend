import { IsNotEmpty, Length, Validate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateStaffRightsDto {
    @ApiProperty()
    id: number;

    @ApiProperty({ default: [] })
    staffRights: string[];
}
