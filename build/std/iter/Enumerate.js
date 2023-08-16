"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enumerate = void 0;
const Option_1 = require("../option/Option");
const Iterator_1 = require("./Iterator");
class Enumerate extends Iterator_1.Iter {
    constructor(iter) {
        super();
        this.i = 0;
        this.iter = iter;
    }
    next() {
        const next = this.iter.next();
        return next.is_none() ? Option_1.None : (0, Option_1.Some)([this.i++, next.unwrap()]);
    }
}
exports.Enumerate = Enumerate;
//# sourceMappingURL=Enumerate.js.map