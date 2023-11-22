import { SharedEntity } from 'src/modules/shared/entity/shared.entity';
import { ApiProperty } from "@nestjs/swagger";

export class UpdateOrderDto extends SharedEntity {
    @ApiProperty()
    id: number;

    @ApiProperty()
    invoiceId: number;

    @ApiProperty()
    invoiceStatus: string;

    @ApiProperty()
    invoiceReference: string;

    @ApiProperty()
    customerReference: string;

    @ApiProperty()
    createdDate: string;

    @ApiProperty()
    expiryDate: string;

    @ApiProperty()
    expiryTime: string;

    @ApiProperty()
    invoiceValue: number;

    @ApiProperty()
    comments: string;

    @ApiProperty()
    customerName: string;

    @ApiProperty()
    customerMobile: string;

    @ApiProperty()
    customerEmail: string;

    @ApiProperty()
    userDefinedField: string;

    @ApiProperty()
    invoiceDisplayValue: string;

    @ApiProperty()
    dueDeposit: string;

    @ApiProperty()
    depositStatus: string;

    @ApiProperty()
    invoiceItems: string;

    @ApiProperty()
    suppliers: string;

    @ApiProperty()
    transactionDate: string;

    @ApiProperty()
    paymentGateway: string;

    @ApiProperty()
    referenceId: string;

    @ApiProperty()
    trackId: string;

    @ApiProperty()
    transactionId: string;

    @ApiProperty()
    paymentId: string;

    @ApiProperty()
    authorizationId: string;

    @ApiProperty()
    transactionStatus: string;

    @ApiProperty()
    transactionValue: string;

    @ApiProperty()
    customerServiceCharge: string;

    @ApiProperty()
    totalServiceCharge: string;

    @ApiProperty()
    dueValue: string;

    @ApiProperty()
    paidCurrency: string;

    @ApiProperty()
    paidCurrencyValue: string;

    @ApiProperty()
    ipAddress: string;

    @ApiProperty()
    country: string;

    @ApiProperty()
    currency: string;

    @ApiProperty({ isArray: true })
    error: string;

    @ApiProperty()
    cardNumber: string;

    @ApiProperty()
    errorCode: string;
}; 