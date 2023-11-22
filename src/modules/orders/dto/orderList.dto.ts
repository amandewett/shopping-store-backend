import { SharedEntity } from 'src/modules/shared/entity/shared.entity';
import { ApiProperty } from "@nestjs/swagger";
import { Column } from 'typeorm';

export class OrderListDto extends SharedEntity {
    @ApiProperty({ default: "createdAt" })
    sortColumnName: string;

    @ApiProperty({ default: "DESC" })
    sortColumnOrder: string;

    @ApiProperty()
    isInternational: number;

    @ApiProperty({ nullable: true })
    countryId: number;

    @ApiProperty()
    userId: number;

    @ApiProperty()
    orderStatus: string;

    @ApiProperty()
    invoiceStatus: string;

    @ApiProperty({ default: "01-01-2023" })
    fromDate: string;

    @ApiProperty({ default: "01-01-2023" })
    toDate: string;

}; 