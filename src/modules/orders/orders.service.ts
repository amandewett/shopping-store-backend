import { Injectable } from '@nestjs/common';
import { OrderEntity } from './entity/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindManyOptions, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/createOrder.dto';
import { UpdateOrderDto } from './dto/updateOrder.dto';
import { Boolean, OrderStatus, Roles } from "../../enums/enum";
import { CountryService } from '../country/country.service';
import { InternationalShipmentService } from '../international-shipment/international-shipment.service';
import { OrderListDto } from './dto/orderList.dto';
import { ManageOrderDto } from './dto/manageOrder.dto';
import * as soap from "soap";
import * as fs from "fs";
import { UserService } from '../user/user.service';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(OrderEntity)
        private orderRepository: Repository<OrderEntity>,
        private countryService: CountryService,
        private internationalShipmentService: InternationalShipmentService,
        private userService: UserService,
    ) { }

    createOrder(userId: number, data: CreateOrderDto) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                let orderObj = new OrderEntity();
                orderObj.userId = userId;
                orderObj.cartItems = data.cartItems;
                orderObj.itemsTotal = data.itemsTotal;
                orderObj.taxId = data.taxId;
                orderObj.taxPercent = data.taxPercent;
                orderObj.taxValue = data.taxValue;
                orderObj.couponId = data.couponId;
                orderObj.discountValue = data.discountValue;
                orderObj.discountPercent = data.discountPercent;
                orderObj.shipmentPrice = data.shipmentPrice;
                orderObj.totalCartValue = data.totalCartValue;
                orderObj.totalCartWeight = data.totalCartWeight;
                orderObj.isInternational = data.isInternational;
                orderObj.countryId = data.countryId;
                orderObj.shippingAddressId = data.shippingAddressId;
                orderObj.billingAddressId = data.billingAddressId;
                orderObj.invoiceId = data.invoiceId;

                const order = await this.orderRepository.save(orderObj);

                resolve({
                    status: true,
                    message: `Order created successfully`,
                    orderId: order.id,
                });
            } catch (e) {
                console.log(e);
                reject({
                    status: false,
                    error: 'Error, please check server logs for more information.'
                });
            }
        });
    }

    testSoap() {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const wsdlFile = "src/config/aramex/shipping-services-api-wsdl.wsdl";

                const args = {
                    Shipments: {
                        Shipment: {
                            Shipper: {
                                Reference1: 'Ref 111111',
                                Reference2: 'Ref 222222',
                                AccountNumber: '20016',
                                PartyAddress: {
                                    Line1: 'Mecca St',
                                    Line2: '',
                                    Line3: '',
                                    City: 'Amman',
                                    StateOrProvinceCode: '',
                                    PostCode: '',
                                    CountryCode: 'Jo',
                                },
                                Contact: {
                                    Department: '',
                                    PersonName: 'Michael',
                                    Title: '',
                                    CompanyName: 'Aramex',
                                    PhoneNumber1: '5555555',
                                    PhoneNumber1Ext: '125',
                                    PhoneNumber2: '',
                                    PhoneNumber2Ext: '',
                                    FaxNumber: '',
                                    CellPhone: '07777777',
                                    EmailAddress: 'michael@aramex.com',
                                    Type: '',
                                },
                            },
                            Consignee: {
                                Reference1: 'Ref 333333',
                                Reference2: 'Ref 444444',
                                AccountNumber: '',
                                PartyAddress: {
                                    Line1: '15 ABC St',
                                    Line2: '',
                                    Line3: '',
                                    City: 'Dubai',
                                    StateOrProvinceCode: '',
                                    PostCode: '',
                                    CountryCode: 'AE',
                                },
                                Contact: {
                                    Department: '',
                                    PersonName: 'Mazen',
                                    Title: '',
                                    CompanyName: 'Aramex',
                                    PhoneNumber1: '6666666',
                                    PhoneNumber1Ext: '155',
                                    PhoneNumber2: '',
                                    PhoneNumber2Ext: '',
                                    FaxNumber: '',
                                    CellPhone: '',
                                    EmailAddress: 'mazen@aramex.com',
                                    Type: '',
                                },
                            },
                            ThirdParty: {
                                Reference1: '',
                                Reference2: '',
                                AccountNumber: '',
                                PartyAddress: {
                                    Line1: '',
                                    Line2: '',
                                    Line3: '',
                                    City: '',
                                    StateOrProvinceCode: '',
                                    PostCode: '',
                                    CountryCode: '',
                                },
                                Contact: {
                                    Department: '',
                                    PersonName: '',
                                    Title: '',
                                    CompanyName: '',
                                    PhoneNumber1: '',
                                    PhoneNumber1Ext: '',
                                    PhoneNumber2: '',
                                    PhoneNumber2Ext: '',
                                    FaxNumber: '',
                                    CellPhone: '',
                                    EmailAddress: '',
                                    Type: '',
                                },
                            },
                            Reference1: 'Shpt 0001',
                            Reference2: '',
                            Reference3: '',
                            ForeignHAWB: 'ABC 000111',
                            TransportType: 0,
                            ShippingDateTime: new Date().toISOString(),
                            DueDate: new Date().toISOString(),
                            PickupLocation: 'Reception',
                            PickupGUID: '',
                            Comments: 'Shpt 0001',
                            AccountingInstrcutions: '',
                            OperationsInstructions: '',
                            Details: {
                                Dimensions: {
                                    Length: 10,
                                    Width: 10,
                                    Height: 10,
                                    Unit: 'cm',
                                },
                                ActualWeight: {
                                    Value: 0.5,
                                    Unit: 'Kg',
                                },
                                ProductGroup: 'EXP',
                                ProductType: 'PDX',
                                PaymentType: 'P',
                                PaymentOptions: '',
                                Services: '',
                                NumberOfPieces: 1,
                                DescriptionOfGoods: 'Docs',
                                GoodsOriginCountry: 'Jo',
                                CashOnDeliveryAmount: {
                                    Value: 0,
                                    CurrencyCode: '',
                                },
                                InsuranceAmount: {
                                    Value: 0,
                                    CurrencyCode: '',
                                },
                                CollectAmount: {
                                    Value: 0,
                                    CurrencyCode: '',
                                },
                                CashAdditionalAmount: {
                                    Value: 0,
                                    CurrencyCode: '',
                                },
                                CashAdditionalAmountDescription: '',
                                CustomsValueAmount: {
                                    Value: 0,
                                    CurrencyCode: '',
                                },
                                Items: [
                                    {
                                        PackageType: 'Box',
                                        Quantity: 1,
                                        Weight: {
                                            Value: 0.5,
                                            Unit: 'Kg',
                                        },
                                        Comments: 'Docs',
                                        Reference: '',
                                    },
                                ],
                            },
                        },
                    },
                    ClientInfo: {
                        AccountCountryCode: 'GB',
                        AccountEntity: 'LON',
                        AccountNumber: '102331',
                        AccountPin: '321321',
                        UserName: 'testintapi@aramex.com',
                        Password: 'R123456789$r',
                        Version: '1.0',
                    },
                    Transaction: {
                        Reference1: '001',
                        Reference2: '',
                        Reference3: '',
                        Reference4: '',
                        Reference5: '',
                    },
                    LabelInfo: {
                        ReportID: 9201,
                        ReportType: 'URL',
                    },
                };

                soap.createClient(wsdlFile, (err, client) => {
                    if (err) {
                        console.error('Error creating SOAP client:', err);
                        reject({
                            status: false,
                            error: err
                        });
                    } else {
                        client.CreateShipments(args, (err, result) => {
                            if (err) {
                                console.error('Error calling CreateShipments:', err);
                                reject({
                                    status: false,
                                    error: err
                                });
                            } else {
                                console.log(result.response.body);
                            }
                        });
                    }
                });
            } catch (e) {
                console.log(e);
                reject({
                    status: false,
                    error: 'Error, please check server logs for more information.'
                });
            }
        });
    }

    updateOrder(userId: number, data: UpdateOrderDto) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                let order = await this.orderRepository.findOne({
                    where: {
                        id: data.id,
                        userId: userId,
                        invoiceId: data.invoiceId,
                    }
                });

                if (order) {
                    order.invoiceStatus = data.invoiceStatus;
                    order.invoiceReference = data.invoiceReference;
                    order.customerReference = data.customerReference;
                    order.createdDate = data.createdDate;
                    order.expiryDate = data.expiryDate;
                    order.expiryTime = data.expiryTime;
                    order.invoiceValue = data.invoiceValue;
                    order.comments = data.comments;
                    order.customerName = data.customerName;
                    order.customerMobile = data.customerMobile;
                    order.customerEmail = data.customerEmail;
                    order.userDefinedField = data.userDefinedField;
                    order.invoiceDisplayValue = data.invoiceDisplayValue;
                    order.dueDeposit = data.dueDeposit;
                    order.depositStatus = data.depositStatus;
                    order.invoiceItems = data.invoiceItems;
                    order.suppliers = data.suppliers;
                    order.transactionDate = data.transactionDate;
                    order.paymentGateway = data.paymentGateway;
                    order.referenceId = data.referenceId;
                    order.trackId = data.trackId;
                    order.transactionId = data.transactionId;
                    order.paymentId = data.paymentId;
                    order.authorizationId = data.authorizationId;
                    order.transactionStatus = data.transactionStatus;
                    order.transactionValue = data.transactionValue;
                    order.customerServiceCharge = data.customerServiceCharge;
                    order.totalServiceCharge = data.totalServiceCharge;
                    order.dueValue = data.dueValue;
                    order.paidCurrency = data.paidCurrency;
                    order.paidCurrencyValue = data.paidCurrencyValue;
                    order.ipAddress = data.ipAddress;
                    order.country = data.country;
                    order.currency = data.currency;
                    order.error = data.error;
                    order.cardNumber = data.cardNumber;
                    order.errorCode = data.errorCode;

                    await this.orderRepository.save(order);

                    resolve({
                        status: true,
                        message: `Order updated successfully`
                    });
                }
                else {
                    resolve({
                        status: false,
                        message: `Order doesn't exists`
                    });
                }
            } catch (e) {
                console.log(e);
                reject({
                    status: false,
                    error: 'Error, please check server logs for more information.'
                });
            }
        });
    }

    appOrderList(userId: number) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const orderList: any = await this.orderRepository.find({
                    where: {
                        userId: userId,
                    },
                    order: {
                        createdAt: "DESC"
                    }
                });

                for (const order of orderList) {
                    if (order.isInternational == Boolean.True) {
                        const internationalCountryDetails: any = await this.internationalShipmentService.detailsInternationalShipment(order.countryId);
                        order.internationalCountryDetails = internationalCountryDetails.result;
                    }
                    else {
                        const countryDetails: any = await this.countryService.countryDetails(order.countryId);
                        order.countryDetails = countryDetails.result;
                    }
                }

                resolve({
                    status: true,
                    result: orderList
                });
            } catch (e) {
                console.log(e);
                reject({
                    status: false,
                    error: 'Error, please check server logs for more information.'
                });
            }
        });
    }

    staffOrderList(userId: number, role: string, countryId: number, pageNumber: number, limit: number, data: OrderListDto) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                let filters: any = {
                    where: {

                    },
                    order: {
                        [`${data.sortColumnName}`]: data.sortColumnOrder,
                    },
                };


                if (role == Roles.SuperAdmin) {
                    if (data.countryId != null) {
                        filters.where.countryId = data.countryId;
                    }
                }
                else {
                    filters.where.countryId = countryId;
                }

                if (data.userId != null) {
                    filters.where.userId = data.userId;
                }

                if (data.orderStatus != null) {
                    filters.where.orderStatus = data.orderStatus;
                }

                if (data.invoiceStatus != null) {
                    filters.where.invoiceStatus = data.invoiceStatus;
                }

                if (data.fromDate != null) {
                    if (data.fromDate == data.toDate) {
                        resolve({
                            status: false,
                            message: `From and to dates can not be same.`
                        });
                    }
                    filters.where.createdAt = Between(new Date(data.fromDate), new Date(data.toDate));
                }
                const orders: any = await this.orderRepository.find(filters);

                //pagination
                const startIndex = (pageNumber - 1) * limit;
                const endIndex = pageNumber * limit;
                let finalResult = orders.slice(startIndex, endIndex);

                for (const order of finalResult) {
                    if (order.isInternational == Boolean.True) {
                        const internationalCountryDetails: any = await this.internationalShipmentService.detailsInternationalShipment(order.countryId);
                        order.internationalCountryDetails = internationalCountryDetails.result;
                    }
                    else {
                        const countryDetails: any = await this.countryService.countryDetails(order.countryId);
                        order.countryDetails = countryDetails.result;
                    }

                    //add user details
                    const userDetails = await this.userService.getUserDetails(order.userId);
                    order.userDetails = userDetails.result;
                }

                resolve({
                    status: true,
                    result: finalResult
                });

            } catch (e) {
                console.log(e);
                reject({
                    status: false,
                    error: 'Error, please check server logs for more information.'
                });
            }
        });
    }

    orderDetails(userId: number, orderId: number) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const order: any = await this.orderRepository.findOne({
                    where: {
                        id: orderId,
                    }
                });

                if (order) {
                    if (order.isInternational == Boolean.True) {
                        const internationalCountryDetails: any = await this.internationalShipmentService.detailsInternationalShipment(order.countryId);
                        order.internationalCountryDetails = internationalCountryDetails.result;
                    }
                    else {
                        const countryDetails: any = await this.countryService.countryDetails(order.countryId);
                        order.countryDetails = countryDetails.result;
                    }

                    //add user details
                    const userDetails = await this.userService.getUserDetails(order.userId);
                    order.userDetails = userDetails.result;

                    resolve({
                        status: true,
                        result: order
                    });
                }
                else {
                    resolve({
                        status: false,
                        message: `Order doesn't exists`
                    });
                }
            } catch (e) {
                console.log(e);
                reject({
                    status: false,
                    error: 'Error, please check server logs for more information.'
                });
            }
        });
    }

    manageOrder(userId: number, role: string, countryId: number, data: ManageOrderDto) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const order = await this.orderRepository.findOne({
                    where: {
                        id: data.orderId,
                    }
                });

                if (order) {
                    order.orderStatus = data.orderStatus;
                    await this.orderRepository.save(order);

                    resolve({
                        status: true,
                        message: `Order updated successfully`
                    });
                }
                else {
                    resolve({
                        status: false,
                        message: `Order doesn't exists`
                    });
                }
            } catch (e) {
                console.log(e);
                reject({
                    status: false,
                    error: 'Error, please check server logs for more information.'
                });
            }
        });
    }


    camelToSnake(input: string) {
        return input.replace(/[\w]([A-Z])/g, function (m) {
            return m[0] + "_" + m[1];
        }).toLowerCase();
    }

    snakeToCamel(str: string) {
        return str.toLowerCase().replace(/([-_][a-z])/g, (group) =>
            group.toUpperCase().replace('-', '').replace('_', '')
        );
    }
}
