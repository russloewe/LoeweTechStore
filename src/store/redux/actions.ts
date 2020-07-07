"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const action_types_1 = require("./action-types");
exports.productList = products => ({ type: action_types_1.PRODUCT_LIST, payload: products });
exports.updateUser = user => ({ type: action_types_1.UPDATE_USER, payload: user });
exports.contactForm = state => ({ type: action_types_1.CONTACT_FORM, payload: state });
exports.racForm = state => ({ type: action_types_1.RAC_FORM, payload: state });
exports.funnel = state => ({ type: action_types_1.FUNNEL, payload: state });
exports.formState = stuff => ({ type: action_types_1.FORM, payload: stuff });
