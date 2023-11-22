import { SharedEntity } from 'src/modules/shared/entity/shared.entity';
import { ApiProperty } from "@nestjs/swagger";

export class UpdateCustomerAddressDto extends SharedEntity {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    phoneNumber: string;

    @ApiProperty()
    isInternational: number;

    @ApiProperty()
    countryId: number;

    @ApiProperty()
    stateId: number;

    @ApiProperty()
    address: string;

    @ApiProperty()
    address2: string;

    @ApiProperty()
    city: string;

    @ApiProperty()
    postalCode: string;
}; 