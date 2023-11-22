export enum Roles {
    SuperAdmin = 'superAdmin',
    Admin = 'admin',
    SalesManager = 'salesManager',
    Customer = 'customer'
}

export enum Boolean {
    True = 1,
    False = 0,
}

export enum RegistrationType {
    Normal = 0,
    Google = 1,
    Facebook = 2,
    Apple = 3
}

export enum Languages {
    english = 'english',
    arabic = 'arabic'
}

export enum UserRights {
    createSubCategory = '/api/productSubCategory/create',
    updateSubCategory = '/api/productSubCategory/update',
    createCategory = '/api/productCategory/create',
    updateCategory = '/api/productCategory/update',
    createProduct = '/api/product/create',
    updateProduct = '/api/product/update'
}

export enum CustomerAddressType {
    shipping = 'shipping',
    billing = 'billing'
}

export enum OrderStatus {
    pending = "Pending",
    shipped = "Shipped",
    Delivered = "Delivered",
}

export enum InvoiceStatus {
    paid = "Paid",
    failed = "Failed",
}

export enum CouponType {
    monthlyDiscount = 0,
    autoDiscount = 1,
    userCoupon = 2,
};