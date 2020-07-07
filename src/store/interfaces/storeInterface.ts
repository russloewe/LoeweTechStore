import{Product, LineItem, Order, Cart,
    StripeWebhookData, StripeChargeStatus,
       ShipDest,
       StripeEventTypes, StripeEvent,
       PaymentIntent,
       Customer} from './storeTypes';


// Base Request and Response objects for Express Middleware
interface Response{
    sendStatus: {
        (code: number): any;
    };
    json?: {
        (stuff: any): any;
    }
}

interface CustomerRequest{
    session: {
        order?: Order;
        cart?: Cart;
        sid?: string;
        ship_to?: ShipDest;
        customer?: Customer;
        charge_id?: string;
        charge_status?: StripeChargeStatus;
        
    }
}

interface AdminRequest{
    isAuthenticated?: boolean;
    user?: {
        user_type: number;
    };
}

// The Cart Controller Request and Response Interfaces
export interface CartUpdateReq extends CustomerRequest{
    body?: Cart;
}
export interface CartAddItemReq extends CustomerRequest{
    body?: LineItem;
}

export interface CardAddShippingReq extends CustomerRequest{
    body: {
        shipping_info: ShipDest;
    }
}
export interface CartUpdateRes extends Response{};


export interface RemoveItemReqPayload{
    item: number;
};
export interface CartRemoveItemReq extends CustomerRequest{
    body: RemoveItemReqPayload;
};

export interface CartClearReq extends CustomerRequest{};

export interface CartGetReq extends CustomerRequest{};

export interface CartGetRes extends Response{
    json:{
        (cart: Cart): any;
    };
};
// Shipping Controller
export interface ShippingPayload{
    shipping: ShipDest;
    customer: Customer;
};
export interface ShippingGetReq extends CustomerRequest{};

export interface ShippingUpdateReq extends CustomerRequest{
    body: ShippingPayload
};
export interface ShippingControllerResponse extends Response{
    json:{
        (payload: ShippingPayload): any;
    },
    sendStatus:{
        (error: ErrorCode): any;
    }
}

// The Product Controller Request and Response Interfaces
export interface ProductListReq {};

export interface ProductListRes extends Response{
    json:{
        (products: Product[]): any;
    }
};

export interface AddProductReq extends AdminRequest{
    body: Product;
};

export interface AddProductRes extends Response{};

export interface UpdateProductReq extends AddProductReq{};
export interface UpdateProductRes extends Response{};

// The Payment Controller Request and Response Interfaces
export interface GetOrderPayload {
    orders: Order[];
}

export interface UpdateOrderPayload{
    order: Order;
}

export interface GetOrderReq extends AdminRequest {};

export interface GetOrderRes extends Response{
    payload: GetOrderPayload;
};

export interface UpdateOrderRes extends Response{
}

export interface UpdateOrderReq extends AdminRequest{
    body: UpdateOrderPayload;
}

export interface OrderCheckoutReq extends CustomerRequest{

};

export interface OrderCheckoutRes extends Response{
    json: {
        (res: CheckoutResponse): any;
    }
};

export interface CheckoutResponse {
    error: boolean;
    order_id?: number;
    client_secret?: string;
    error_code?: number;
    error_message?: string;
    error_details?: string;
}

export interface PaymentIntentWebhookReq {
    header?: {
        (header: string): string;
    };
    headers?: any;
    rawBody?: any;
    body: StripeEvent;
};

export interface PaymentWebhookRes extends Response{};

export enum htmlInputTypes{
    number='number',
    check='check',
    select='select'
};

export enum ErrorCode{
    modelError=503,
    controllerError=501,
    badReq=400,
    authError=401,
    captchaError=403
};

export enum CheckoutErrorCode{
    orderError,
    lineItemError,
    stripeError,
    clientError
};

// CONTROLLERE CONFIGUATION OPTIONS
export interface OrderControllerOptions{
    knexClient: any;
    stripeClient: any;
    mailClient: any;
}
