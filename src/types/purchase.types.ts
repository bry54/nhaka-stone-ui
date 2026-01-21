// Purchase Item Interface
export interface PurchaseItem {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

// Customer Interface
export interface Customer {
    id?: string;
    fullName: string;
    email: string;
    phone: string;
}

// Delivery/Shipping Interface
export interface Delivery {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

// Payment Processor Response Interface
export interface PaymentProcessorResponse {
    authorizationCode: string;
    receiptUrl: string;
    last4: string | null;
    cardBrand: string | null;
}

// Payment Interface
export interface Payment {
    // Payment method details
    method: 'credit-card' | 'paypal' | 'google-pay' | 'apple-pay';
    provider: 'Stripe' | 'PayPal' | 'Google Pay' | 'Apple Pay';

    // Transaction details
    transactionId: string;
    status: 'pending' | 'completed' | 'failed';
    timestamp: string;

    // Amount details
    currency: string;
    subtotal: number;
    tax: number;
    shippingCost: number;
    discount: number;
    totalAmount: number;

    // Payment processor response
    processorResponse: PaymentProcessorResponse;
}

// Order Summary Interface
export interface OrderSummary {
    itemCount: number;
    subtotal: number;
    total: number;
    currency: string;
}

// Main Purchase Data Interface
export interface PurchaseData {
    // Order information
    orderId: string;

    orderDate: string;

    // Items
    item: PurchaseItem;

    // Customer information
    customer: Customer;

    // Delivery information
    delivery: Delivery;

    // Payment information
    payment: Payment;

    // Order summary
    summary: OrderSummary;
}
