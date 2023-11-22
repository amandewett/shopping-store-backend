import { SharedEntity } from 'src/modules/shared/entity/shared.entity';
import { ApiProperty } from "@nestjs/swagger";

export class CreateOrderDto extends SharedEntity {
    @ApiProperty({ isArray: true })
    cartItems: string;

    @ApiProperty()
    itemsTotal: number;

    @ApiProperty()
    taxId: number;

    @ApiProperty()
    taxPercent: number;

    @ApiProperty()
    taxValue: number;

    @ApiProperty()
    couponId: number;

    @ApiProperty()
    discountValue: number;

    @ApiProperty()
    discountPercent: number;

    @ApiProperty()
    shipmentPrice: number;

    @ApiProperty()
    totalCartValue: number;

    @ApiProperty()
    totalCartWeight: number;

    @ApiProperty()
    isInternational: number;

    @ApiProperty()
    countryId: number;

    @ApiProperty()
    shippingAddressId: number;

    @ApiProperty()
    billingAddressId: number;

    @ApiProperty()
    invoiceId: number;
}; 