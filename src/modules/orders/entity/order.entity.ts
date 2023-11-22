import { SharedEntity } from 'src/modules/shared/entity/shared.entity';
import { CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, Column } from 'typeorm';
import { Boolean, Roles, RegistrationType, CustomerAddressType, OrderStatus } from "../../../enums/enum";

@Entity({ name: "orders" })
export class OrderEntity extends SharedEntity {
    @Column()
    userId: number;

    @Column({ nullable: true, type: 'json' })
    cartItems: string;

    @Column({ type: "double", precision: 10, scale: 2, default: 0.00 })
    itemsTotal: number;

    @Column()
    taxId: number;

    @Column({ type: "double", precision: 10, scale: 2, default: 0.00 })
    taxPercent: number;

    @Column({ type: "double", precision: 10, scale: 2, default: 0.00 })
    taxValue: number;

    @Column({ nullable: true })
    couponId: number;

    @Column({ type: "double", precision: 10, scale: 2, default: 0.00 })
    discountValue: number;

    @Column({ type: "double", precision: 10, scale: 2, default: 0.00 })
    discountPercent: number;

    @Column({ type: "double", precision: 10, scale: 2, default: 0.00 })
    shipmentPrice: number;

    @Column({ type: "double", precision: 10, scale: 2, default: 0.00 })
    totalCartValue: number;

    @Column({ type: "double", precision: 10, scale: 2, default: 0.00 })
    totalCartWeight: number;

    @Column({ default: Boolean.False })
    isInternational: number;

    @Column({ nullable: true })
    countryId: number;

    @Column({ nullable: true })
    shippingAddressId: number;

    @Column({ nullable: true })
    billingAddressId: number;

    @Column({ unique: true })
    invoiceId: number;

    @Column({ nullable: true })
    invoiceStatus: string;

    @Column({ nullable: true })
    invoiceReference: string;

    @Column({ nullable: true })
    customerReference: string;

    @Column({ nullable: true })
    createdDate: string;

    @Column({ nullable: true })
    expiryDate: string;

    @Column({ nullable: true })
    expiryTime: string;

    @Column({ type: "double", precision: 10, scale: 2, default: 0.00 })
    invoiceValue: number;

    @Column({ nullable: true })
    comments: string;

    @Column({ nullable: true })
    customerName: string;

    @Column({ nullable: true })
    customerMobile: string;

    @Column({ nullable: true })
    customerEmail: string;

    @Column({ nullable: true })
    userDefinedField: string;

    @Column({ nullable: true })
    invoiceDisplayValue: string;

    @Column({ nullable: true })
    dueDeposit: string;

    @Column({ nullable: true })
    depositStatus: string;

    @Column({ nullable: true, type: 'json' })
    invoiceItems: string;

    @Column({ nullable: true, type: 'json' })
    suppliers: string;

    @Column({ nullable: true })
    transactionDate: string;

    @Column({ nullable: true })
    paymentGateway: string;

    @Column({ nullable: true })
    referenceId: string;

    @Column({ nullable: true })
    trackId: string;

    @Column({ nullable: true })
    transactionId: string;

    @Column({ nullable: true })
    paymentId: string;

    @Column({ nullable: true })
    authorizationId: string;

    @Column({ nullable: true })
    transactionStatus: string;

    @Column({ nullable: true })
    transactionValue: string;

    @Column({ nullable: true })
    customerServiceCharge: string;

    @Column({ nullable: true })
    totalServiceCharge: string;

    @Column({ nullable: true })
    dueValue: string;

    @Column({ nullable: true })
    paidCurrency: string;

    @Column({ nullable: true })
    paidCurrencyValue: string;

    @Column({ nullable: true })
    ipAddress: string;

    @Column({ nullable: true })
    country: string;

    @Column({ nullable: true })
    currency: string;

    @Column({ nullable: true, type: 'json' })
    error: string;

    @Column({ nullable: true })
    cardNumber: string;

    @Column({ nullable: true })
    errorCode: string;

    @Column({ default: OrderStatus.pending })
    orderStatus: string;
}; 