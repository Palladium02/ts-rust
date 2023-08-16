"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ordering_1 = require("../cmp/Ordering");
const Option_1 = require("../option/Option");
Number.prototype.clone = function () {
    return Number(this);
};
Number.prototype.clone_from = function (_) {
    throw new Error('Cannot clone into Number type');
};
Number.prototype.cmp = function (rhs) {
    if (Number(this) < rhs)
        return Ordering_1.Ordering.Less;
    if (Number(this) > rhs)
        return Ordering_1.Ordering.Greater;
    return Ordering_1.Ordering.Equal;
};
// @ts-ignore
Number.prototype.max = function (rhs) {
    if (Number(this) < rhs)
        return rhs;
    return this;
};
// @ts-ignore
Number.prototype.min = function (rhs) {
    if (Number(this) < rhs)
        return this;
    return rhs;
};
Number.prototype.partial_cmp = function (rhs) {
    return (0, Option_1.Some)(this.cmp(rhs));
};
Number.prototype.eq = function (rhs) {
    return this === rhs;
};
Number.prototype.ne = function (rhs) {
    return this !== rhs;
};
Number.prototype.default = () => 0;
//# sourceMappingURL=Number.js.map