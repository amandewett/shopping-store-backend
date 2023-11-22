import { SharedEntity } from 'src/modules/shared/entity/shared.entity';
import { ApiProperty } from "@nestjs/swagger";
import { Column } from 'typeorm';
import { OrderStatus } from 'src/enums/enum';

export class ManageOrderDto extends SharedEntity {
    @ApiProperty()
    orderId: number;

    @ApiProperty({ default: OrderStatus.pending })
    orderStatus: string;

}; 