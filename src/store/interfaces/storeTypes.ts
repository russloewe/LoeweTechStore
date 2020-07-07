
import {htmlInputTypes} from '../interfaces/storeInterface';
// Database Tables Products and Orders
export interface ProductChoice{
    label: string;
    cost: number;
    img_url: string;
};

export interface SelectOption{
    type: "select";
    label: string;
    value: string;
    choices: ProductChoice[];
};

export interface NumberOption{
    type: "number";
    label: string;
    value: number
};

export interface CheckOption{
    type: "check";
    label: string;
    value: boolean;
};

export interface TextOption{
    type: "text";
    label: string;
    value: string;
};

export type ProductOption = SelectOption|NumberOption|CheckOption|TextOption;
export type ProductOptions = Array<SelectOption|NumberOption|CheckOption|TextOption>;
     

export interface ProductDetails{
    name: string;
    category: ProductCategory,
    image_urls: string[];
    description: string;
    options: ProductOptions;
}

export interface Product{
    id: number;
    price: number;
    name: string;
    category: ProductCategory,
    published: boolean,
    image_urls: string[];
    description: string;
    options: ProductOptions;

    qty: number; 
};

export interface LineItemOptionValues{
    [key: string]: string;
};

export interface LineItemDetails{
    sub_total: number;
    product_details?: ProductDetails;
    options: LineItemOptionValues;

}

export interface LineItem {
    product_id: number;
    order_id?: number;
    qty: number;
    sub_total: number;
    name: string;
    thumb_url: string;
    options: LineItemOptionValues;
    product_options?: ProductOptions;
}

export interface Cart{
    items: LineItem[];
    charge_status: StripeChargeStatus;
    charge_id?: string;   
    total: number;
    item_count: number;
}
export interface Order {
    cart: Cart;
    ship_to: ShipDest;
    shipped: boolean;
    ship_tracking?: string;
    customer?: Customer;
    charge_status?: string;
    charge_id?: string;
    id?: number;
};


export interface ShipDest{
    name: string;
    city: string;
    addr_1: string;
    addr_2?: string;
    state: string|SupportedStates;
    zipcode: string;
    email?: string;
}

export interface PaymentIntent{
    id?: string;
    status?: string;
    object?: string;
    transfer_data?: {
        destination: string;
    }
};

export interface newStripeCharge{
    amount: number;
    currency: SupportedCurrency;
    description: string;
    source: string;
};

export interface StripeWebhookData{
    id: string; // stripe charge id
    amount: number;
    captured: boolean;
    description: {
        order_id: string;
    };
    status: StripeChargeStatus;
}

export interface StripeEvent{
    id: string;
    type: StripeEventTypes;
    data: {
        object: PaymentIntent;
    }
    
}

export interface Customer{
    name?: string;
    email?: string;
};

// Enums
export enum ProductCategory{
    burgers,
    sides,
    drinks,
};

export enum SupportedCurrency{
    usd='usd'
};
export enum StripeChargeStatus{
    none='',
    pending='pending',
    succeeded='succeeded',
    failed='failed'
};
export enum StripeEventTypes{
//apiVersion: '2020-03-02'
    payment_succeeded='payment_intent.succeeded',
    payment_failed='payment_intent.payment_failed'
};

export enum SupportedStates{
    Oregon='OR',
}


