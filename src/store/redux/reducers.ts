"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const action_types_1 = require("./action-types");
const initialState = {
    user: false,
    products: [],
    contactForm: 'visible',
    racForm: 'visible',
    funnel: 'awareness'
};
const rootReducer = (state = initialState, action) => {
    const newState = Object.assign({}, state);
    switch (action.type) {
        case action_types_1.PRODUCT_LIST:
            newState.products = action.payload;
            return newState;
        case action_types_1.UPDATE_USER:
            newState.user = action.payload;
            return newState;
        case action_types_1.FORM:
            name = action.payload.name;
            state = action.payload.state;
            newState[name] = state;
            return newState;
        case action_types_1.CONTACT_FORM:
            newState.contactForm = action.payload;
            return newState;
        case action_types_1.RAC_FORM:
            newState.racForm = action.payload;
            return newState;
        case action_types_1.FUNNEL:
            newState.funnel = action.payload;
            return newState;
        default:
            return state;
    }
};
exports.default = rootReducer;
