// Import types
import {
    Product, ProductCategory, ProductChoice, 
    ProductDetails, ProductOption,
    LineItem, LineItemDetails,
    Order, Cart,
    StripeWebhookData, newStripeCharge, StripeChargeStatus,
    SupportedCurrency, SupportedStates, ShipDest} from '../interfaces/storeTypes';


export var testProduct1: Product = {
    published: true,
    id: 1,
    qty: 4,
    name: 'test prod',
    category: ProductCategory.burgers,
    description: 'stuff',
    image_urls:[],
    price: 111,
    options: [],
};
export var testProduct2: Product = {
    published: true,
    id: 2,
    qty: 4,
    name: 'test prod 2',
    category: ProductCategory.burgers,
    description: 'stuff',
    image_urls:[],
    price: 222,
    options: [],
};
export var testProduct3: Product = {
    published: true,
    id: 3,
    qty: 4,
    name: 'test prod',
    category: ProductCategory.burgers,
    description: 'stuff',
    image_urls:[],
    price: 333,
    options: [],

};

export var testLineItem1: LineItem = {
    product_id: 1,
    qty: 1,
    name: 'test prod',
    thumb_url:'[]',
    options: {'color': 'green'},
    sub_total: 111
}

export var testLineItem2: LineItem = {
    product_id: 2,
    qty: 2,
    name: 'test prod 2',
    thumb_url:'[]',
    options: {'color': 'green'},
    sub_total: 222
}
export var testLineItem3: LineItem = {
    product_id: 3,
    qty: 3,
    name: 'test prod 2',
    thumb_url:'[]',
    options: {'color': 'green'},
    sub_total: 333,

}

export var testDest: ShipDest = {
    name: 'test name',
    addr_1: 'test street',
    state: SupportedStates.Oregon,
    zipcode: '90210',
    city: 'test city'
}


export let testorder = {
    items: [testProduct1, testProduct2],
    charge_status: StripeChargeStatus.none,
    ship_to: {
        name: 'test name',
        addr1: 'test street',
        state: 'OR',
        zipcode: 90210},
    total: 222
}
export let testsession =  {
    sid: 'testsid',
    order: testorder
};
    
export let testcharge: newStripeCharge = {
    description: 'e',
    currency: SupportedCurrency.usd,
    amount: 320,
    source: 'test source'
};
