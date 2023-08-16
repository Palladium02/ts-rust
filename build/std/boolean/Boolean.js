"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ordering_1 = require("../cmp/Ordering");
const Option_1 = require("../option/Option");
Boolean.prototype.clone = function () {
    return Boolean(this);
};
Boolean.prototype.clone_from = function (_) {
    throw new Error('Cannot clone into Boolean type');
};
Boolean.prototype.cmp = function (rhs) {
    if (this < rhs)
        return Ordering_1.Ordering.Less;
    if (this > rhs)
        return Ordering_1.Ordering.Greater;
    return Ordering_1.Ordering.Equal;
};
// @ts-ignore
Boolean.prototype.max = function (rhs) {
    if (this < rhs)
        return rhs;
    return this;
};
// @ts-ignore
Boolean.prototype.min = function (rhs) {
    if (this < rhs)
        return this;
    return rhs;
};
Boolean.prototype.partial_cmp = function (rhs) {
    return (0, Option_1.Some)(this.cmp(rhs));
};
Boolean.prototype.eq = function (rhs) {
    return this === rhs;
};
Boolean.prototype.ne = function (rhs) {
    return this !== rhs;
};
//# sourceMappingURL=Boolean.js.map