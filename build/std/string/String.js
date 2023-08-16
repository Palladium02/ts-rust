"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ordering_1 = require("../cmp/Ordering");
const Option_1 = require("../option/Option");
String.prototype.clone = function () {
    return String(this);
};
String.prototype.clone_from = function (_) {
    throw new Error('Cannot clone into String type as strings are immutable');
};
String.prototype.cmp = function (rhs) {
    if (this < rhs)
        return Ordering_1.Ordering.Less;
    if (this > rhs)
        return Ordering_1.Ordering.Greater;
    return Ordering_1.Ordering.Equal;
};
String.prototype.max = function (rhs) {
    if (this < rhs)
        return rhs;
    return this;
};
// @ts-ignore
String.prototype.min = function (rhs) {
    if (this < rhs)
        return this;
    return rhs;
};
String.prototype.partial_cmp = function (rhs) {
    return (0, Option_1.Some)(this.cmp(rhs));
};
String.prototype.eq = function (rhs) {
    return this === rhs;
};
String.prototype.ne = function (rhs) {
    return this !== rhs;
};
//# sourceMappingURL=String.js.map